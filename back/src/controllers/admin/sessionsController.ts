import { RequestHandler } from "express";
import { Op } from "sequelize";
import { Film as FilmModel } from "../../models/film";
import { Session } from "../../models/session";
import { Seat } from "../../models/seat";
import { Genre as GenreModel } from "../../models/genre";
import { DailySchedule, FilmForSession } from "../../interfaces/base";
import { Film } from "../../interfaces/models";
import { Genre } from "../../interfaces/models";
import { LocalTime, UTCTime } from "../../util/time-calculation";
import {
  oneFilmScheduleCreator,
  multipleFilmsScheduleCreator,
} from "../../util/schedule-creator";

interface ScheduleForRecalculation extends Partial<DailySchedule> {}
interface FilmForRecalculation extends Partial<FilmForSession> {}
interface SequelizeBaseResponse {
  dataValues: Film;
  _previousDataValues: Film;
  uniqno: 1;
  _changed: Set<number>;
  _options: {
    isNewRecord: Boolean;
    _schema: null;
    _schemaDelimiter: string;
    include: [];
    includeNames: [];
    includeMap: Object[];
    includeValidated: Boolean;
    attributes: string[];
    raw: Boolean;
  };
  isNewRecord: false;
  genres: Genre[];
}

type mode = "local" | "utc";

const ITEMS_PER_PAGE = 4;

export const verifyCreationPossibility: RequestHandler = async (
  req,
  res,
  next
) => {
  const startSchedulePeriod = new Date();
  startSchedulePeriod.setUTCHours(0, 0, 0);
  startSchedulePeriod.setUTCDate(startSchedulePeriod.getUTCDate() + 6);
  const endSchedulePeriod = new Date();
  endSchedulePeriod.setUTCHours(23, 59, 59);
  endSchedulePeriod.setUTCDate(endSchedulePeriod.getUTCDate() + 12);
  try {
    const existingSchedule = await Session.findOne({
      where: {
        filmStart: { [Op.between]: [startSchedulePeriod, endSchedulePeriod] },
      },
    });
    if (existingSchedule) {
      return res
        .status(400)
        .send({ message: "На эти даты расписание уже создано" });
    } else {
      req.body.startSchedulePeriod = startSchedulePeriod;
      req.body.endSchedulePeriod = endSchedulePeriod;
      next();
    }
  } catch (e) {
    return res.status(500).send({ message: e, details: "Серверная ошибка" });
  }
};

export const createSession: RequestHandler = async (req, res, next) => {
  const filmStart: Date = req.body.filmStart;
  const { price } = req.body as { price: number };
  const filmId: number = req.body.id;
  try {
    const session = await Session.create({
      filmStart,
      price,
      filmId,
    });
    const requests = [];
    for (let i = 1; i < 101; i++) {
      requests.push(
        Seat.create({ number: i, orderId: null, sessionId: session.id })
      );
    }
    await Promise.all(requests);
    res.status(201).json({ message: "Сеанс добавлен.", createdFilm: session });
  } catch (e) {
    next(e);
  }
};

const receiveFilms = async (
  start: Date,
  end: Date
): Promise<SequelizeBaseResponse[]> => {
  const films: SequelizeBaseResponse[] = await FilmModel.findAll({
    where: {
      [Op.or]: [
        {
          startDate: {
            [Op.between]: [start, end],
          },
        },
        {
          endDate: {
            [Op.between]: [start, end],
          },
        },
        {
          [Op.and]: [
            {
              startDate: {
                [Op.lt]: start,
              },
            },
            {
              endDate: {
                [Op.gt]: end,
              },
            },
          ],
        },
      ],
    },
    include: {
      model: GenreModel,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      through: { attributes: [] },
    },
    attributes: {
      exclude: ["createdAt", "updatedAt", "description", "posterUrl"],
    },
    distinct: true,
  });
  return films;
};

const calculateTime = (start: Date, mode: mode) => {
  return mode === "local"
    ? new LocalTime(start).timeOfStart
    : new UTCTime(start).timeOfStart;
};

const oneFilmSchedule = (
  film: Film,
  scheduleArr: string[],
  filmEndsBeforeSchedule: Boolean = false
) => {
  const filmScheduleCreator = new oneFilmScheduleCreator(
    scheduleArr,
    film,
    filmEndsBeforeSchedule
  );
  filmScheduleCreator.durationCount(film);
  const arr = scheduleArr.map((el) => {
    const daySchedule = {
      [el]: [],
    };
    filmScheduleCreator.setSchedule(el);
    if (filmEndsBeforeSchedule && filmScheduleCreator.start > film.endDate) {
      return daySchedule;
    }
    while (filmScheduleCreator.start < filmScheduleCreator.end) {
      const timeOfSessionStart = calculateTime(
        filmScheduleCreator.start,
        "local"
      );
      daySchedule[el].push({ [timeOfSessionStart]: film });
      filmScheduleCreator.postponeStart();
    }
    daySchedule[el].pop();
    return daySchedule;
  });
  return arr;
};

const prepareSchedule = (films: Film[], start: Date, end: Date) => {
  if (!films.length) {
    return "Нет фильмов в прокате на эти даты";
  }
  const weekSchedule: string[] = [];
  while (start < end) {
    const keyDate = start.toISOString().split("T")[0];
    weekSchedule.push(keyDate);
    start.setUTCDate(start.getUTCDate() + 1);
  }
  if (films.length === 1) {
    return films[0].endDate > end
      ? oneFilmSchedule(films[0], weekSchedule)
      : oneFilmSchedule(films[0], weekSchedule, true);
  } else {
    const multipleCreator = new multipleFilmsScheduleCreator(
      films,
      weekSchedule
    );
    return multipleCreator.setupBase();
  }
};

export const calculateSchedule: RequestHandler = async (req, res, next) => {
  const { startSchedulePeriod, endSchedulePeriod } = req.body;

  try {
    const receivedFilms: SequelizeBaseResponse[] = await receiveFilms(
      startSchedulePeriod,
      endSchedulePeriod
    );
    const filmsToDistribute: Film[] = receivedFilms.map((el) => el.dataValues);
    const schedule = prepareSchedule(
      filmsToDistribute,
      startSchedulePeriod,
      endSchedulePeriod
    );
    res.status(200).json(schedule);
  } catch (e) {
    return res.status(500).send({ message: e, details: "Серверная ошибка" });
  }
};

export const adjustSchedule: RequestHandler = async (req, res, next) => {
  const arr: ScheduleForRecalculation[] = req.body; //массив фильмов, надо пересчитать время начала фильмов в зависимости от общей продолжительности и установить прайс
  const startOfSession = new Date();
  startOfSession.setHours(8, 0, 0, 0);
  const recalculatedSchedule = arr.map((session) => {
    const timeOfSessionStart = new LocalTime(startOfSession).timeOfStart;
    //пересчитанное время начала сеанса
    const hourOfSessionStart = startOfSession.getHours();
    const basePrice = (Object.values(session)[0] as FilmForRecalculation)
      .basePrice;
    const price =
      hourOfSessionStart < 12
        ? basePrice * 0.85
        : hourOfSessionStart >= 18
        ? basePrice * 1.15
        : basePrice;
    const [hDur, mDur, sDur] = (
      Object.values(session)[0] as FilmForRecalculation
    ).totalDuration.split(":");
    startOfSession.setHours(startOfSession.getHours() + +hDur);
    startOfSession.setMinutes(startOfSession.getMinutes() + +mDur);
    startOfSession.setSeconds(startOfSession.getSeconds() + +sDur);
    return {
      [timeOfSessionStart]: {
        ...(Object.values(session)[0] as FilmForRecalculation),
        price,
      },
    };
  });
  res.status(200).json(recalculatedSchedule);
};
