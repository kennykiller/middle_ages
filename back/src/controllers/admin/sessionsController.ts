import { RequestHandler } from "express";
import { Op } from "sequelize";
import Film from "../../../models/film";
import Session from "../../../models/session";
import Genre from "../../../models/genre";

type mode = "local" | "utc";

const ITEMS_PER_PAGE = 4;

// export const createSession = async (filmId: number, startDate:string, endDate:string, duration: string) => {

//     await Session.bulkCreate();
// }

const receiveFilms = async (start: Date, end: Date): Promise<Film[]> => {
  const films: Film[] = await Film.findAll({
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
      model: Genre,
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
  let hourOfStart = "";
  let minOfStart = "";
  let secOfStart = "";
  if (mode === "local") {
    hourOfStart =
      start.getHours() < 10 ? "0" + start.getHours() : String(start.getHours());
    minOfStart =
      start.getMinutes() < 10
        ? "0" + start.getMinutes()
        : String(start.getMinutes());
    secOfStart =
      start.getSeconds() < 10
        ? "0" + start.getSeconds()
        : String(start.getSeconds());
  } else {
    hourOfStart =
      start.getUTCHours() < 10
        ? "0" + start.getUTCHours()
        : String(start.getUTCHours());
    minOfStart =
      start.getUTCMinutes() < 10
        ? "0" + start.getUTCMinutes()
        : String(start.getUTCMinutes());
    secOfStart =
      start.getUTCSeconds() < 10
        ? "0" + start.getUTCSeconds()
        : String(start.getUTCSeconds());
  }

  return `${hourOfStart}:${minOfStart}:${secOfStart}`;
};

const oneFilmSchedule = (
  film: Film,
  start: Date,
  end: Date,
  scheduleArr: string[],
  filmEndsBeforeSchedule: Boolean = false
) => {
  const [hDur, mDur, sDur] = film.filmDuration.split(":");
  const arr = scheduleArr.map((el) => {
    const daySchedule = {
      [el]: [],
    };
    const scheduleDate = el.split("-")[2];
    const start = new Date(el);
    start.setUTCDate(+scheduleDate);
    start.setUTCHours(5, 0, 0, 0);
    if (filmEndsBeforeSchedule && start > film.endDate) {
      return daySchedule;
    }
    const end = new Date(el);
    end.setUTCDate(+scheduleDate);
    end.setUTCHours(23, 59, 59, 999);
    while (start < end) {
      const timeOfSessionStart = calculateTime(start, "local");
      daySchedule[el].push({ [timeOfSessionStart]: film });
      start.setUTCHours(start.getUTCHours() + +hDur);
      start.setUTCMinutes(start.getUTCMinutes() + +mDur + 15);
      start.setUTCSeconds(start.getUTCSeconds() + +sDur);
    }
    daySchedule[el].pop();
    return daySchedule;
  });
  return arr;
};

const multipleFilmsSchedule = (
  films: Film[],
  start: Date,
  end: Date,
  scheduleArr: string[]
) => {
  const arr = scheduleArr.map((el) => {
    const daySchedule = {
      [el]: [],
    };
    const scheduleDate = el.split("-")[2];
    const start = new Date(el);
    start.setUTCDate(+scheduleDate);
    start.setUTCHours(5, 0, 0, 0); //настроеная дата для каждого нового рабочего дня
    const adjustedFilms = films.map((film) => {
      //фильмы, с добавленными полями для проверки возраста и новый фильм или нет
      const [hDur, mDur, sDur] = film.dataValues.filmDuration.split(":");
      const d = new Date();
      d.setUTCHours(+hDur, +mDur + 15, +sDur);
      const totalDuration = calculateTime(d, "utc");
      const dateForOldCheck = new Date(film.dataValues.startDate);
      dateForOldCheck.setUTCDate(dateForOldCheck.getUTCDate() + 6);

      const fullDay = parseInt(film.dataValues.ageRestriction, 10) > 11;
      return {
        ...film.dataValues,
        totalDuration,
        isOld: dateForOldCheck <= start,
        fullDay,
      };
    });

    const end = new Date(el);
    end.setUTCDate(+scheduleDate);
    end.setUTCHours(23, 59, 59, 999); //настроенная дата для окончания рабочего дня
    if (
      //фильмы либо новые, либо старые с одинаковой возрастной категорией
      adjustedFilms.every((film) => !film.isOld && film.fullDay) ||
      adjustedFilms.every((film) => !film.isOld && !film.fullDay) ||
      adjustedFilms.every((film) => film.isOld && film.fullDay) ||
      adjustedFilms.every((film) => film.isOld && !film.fullDay)
    ) {
      console.log("all are new or old with same ageRestriction");

      let currentIdx = 0;
      const { length } = adjustedFilms;

      while (start < end) {
        const timeOfSessionStart = calculateTime(start, "local");
        daySchedule[el].push({
          [timeOfSessionStart]: adjustedFilms[currentIdx],
        });

        const [hDur, mDur, sDur] =
          adjustedFilms[currentIdx].totalDuration.split(":");
        start.setUTCHours(start.getUTCHours() + +hDur);
        start.setUTCMinutes(start.getUTCMinutes() + +mDur);
        start.setUTCSeconds(start.getUTCSeconds() + +sDur);

        currentIdx = currentIdx + 1 === length ? 0 : currentIdx + 1;
      }
      daySchedule[el].pop();
    }
    if (
      //один фильм новый, а другой старый, но возрастные категории совпадают, чередование 2-1-2
      adjustedFilms.some((film) => film.isOld) &&
      adjustedFilms.some((film) => !film.isOld) &&
      (adjustedFilms.every((film) => film.fullDay) ||
        adjustedFilms.every((film) => !film.fullDay))
    ) {
      console.log("one new another old with same ageRestriction");
      const oldIdxs = adjustedFilms.filter((film) => film.isOld);
      const newIdxs = adjustedFilms.filter((film) => !film.isOld);
      const newMaxInRow = 2 * newIdxs.length;
      const oldMaxInRow = oldIdxs.length;
      let currentOldInRow = 0;
      let currentNewInRow = 0;
      let newIdxToShow = 0;
      while (start < end) {
        const timeOfSessionStart = calculateTime(start, "local");
        if (currentNewInRow < newMaxInRow) {
          daySchedule[el].push({
            [timeOfSessionStart]: newIdxs[newIdxToShow],
          });

          const [hDur, mDur, sDur] =
            adjustedFilms[newIdxToShow].totalDuration.split(":");
          start.setUTCHours(start.getUTCHours() + +hDur);
          start.setUTCMinutes(start.getUTCMinutes() + +mDur);
          start.setUTCSeconds(start.getUTCSeconds() + +sDur);
          currentNewInRow++;
          newIdxToShow =
            newIdxToShow + 1 === newIdxs.length ? 0 : newIdxToShow + 1;
          currentOldInRow = 0;
        } else if (currentOldInRow < oldMaxInRow) {
          daySchedule[el].push({
            [timeOfSessionStart]: oldIdxs[currentOldInRow],
          });
          const [hDur, mDur, sDur] =
            oldIdxs[currentOldInRow].totalDuration.split(":");
          start.setUTCHours(start.getUTCHours() + +hDur);
          start.setUTCMinutes(start.getUTCMinutes() + +mDur);
          start.setUTCSeconds(start.getUTCSeconds() + +sDur);
          currentOldInRow++;
          if (currentOldInRow === oldMaxInRow) {
            currentNewInRow = 0;
            newIdxToShow = 0;
          }
        }
      }
      daySchedule[el].pop();
    } else if (
      (adjustedFilms.every((film) => !film.isOld) ||
        adjustedFilms.every((film) => film.isOld)) &&
      adjustedFilms.some((film) => film.fullDay) &&
      adjustedFilms.some((film) => !film.fullDay)
    ) {
      //разная возрастная категория, оба новых или оба старых
      console.log("both new or old with different ageRestriction");
      let currentIdx = 0;
      const adultFilms = adjustedFilms.filter((film) => film.fullDay);
      let currentAdultIdx = 0;
      const { length } = adjustedFilms;

      while (start < end) {
        const timeOfSessionStart = calculateTime(start, "local");
        if (start.getUTCHours() > 18) {
          daySchedule[el].push({
            [timeOfSessionStart]: adultFilms[currentAdultIdx],
          });
          const [hDur, mDur, sDur] =
            adultFilms[currentAdultIdx].totalDuration.split(":");
          start.setUTCHours(start.getUTCHours() + +hDur);
          start.setUTCMinutes(start.getUTCMinutes() + +mDur);
          start.setUTCSeconds(start.getUTCSeconds() + +sDur);
          currentAdultIdx = adultFilms.findIndex((film) => film.fullDay);
        } else {
          daySchedule[el].push({
            [timeOfSessionStart]: adjustedFilms[currentIdx],
          });
          const [hDur, mDur, sDur] =
            adjustedFilms[currentIdx].totalDuration.split(":");
          start.setUTCHours(start.getUTCHours() + +hDur);
          start.setUTCMinutes(start.getUTCMinutes() + +mDur);
          start.setUTCSeconds(start.getUTCSeconds() + +sDur);
          currentIdx = currentIdx + 1 === length ? 0 : currentIdx + 1;
        }
      }
      daySchedule[el].pop();
    } else {
      //один новый, другой старый и разные возрастные категории
      const oldIdxs = adjustedFilms.filter((film) => film.isOld);
      const newIdxs = adjustedFilms.filter((film) => !film.isOld);
      const newMaxInRow = 2 * newIdxs.length;
      const oldMaxInRow = oldIdxs.length;
      let currentOldInRow = 0;
      let currentNewInRow = 0;
      let newIdxToShow = 0;
      let currentAdultIdx = 0;
      const adultFilms = adjustedFilms.filter((film) => film.fullDay);
      while (start < end) {
        const timeOfSessionStart = calculateTime(start, "local");
        if (start.getHours() > 18) {
          daySchedule[el].push({
            [timeOfSessionStart]: adultFilms[currentAdultIdx],
          });
          const [hDur, mDur, sDur] =
            adultFilms[currentAdultIdx].totalDuration.split(":");
          start.setUTCHours(start.getUTCHours() + +hDur);
          start.setUTCMinutes(start.getUTCMinutes() + +mDur);
          start.setUTCSeconds(start.getUTCSeconds() + +sDur);
          currentAdultIdx =
            ++currentAdultIdx === adultFilms.length ? 0 : currentAdultIdx++;
        } else if (currentNewInRow < newMaxInRow) {
          daySchedule[el].push({
            [timeOfSessionStart]: newIdxs[newIdxToShow],
          });

          const [hDur, mDur, sDur] =
            newIdxs[newIdxToShow].totalDuration.split(":");
          start.setUTCHours(start.getUTCHours() + +hDur);
          start.setUTCMinutes(start.getUTCMinutes() + +mDur);
          start.setUTCSeconds(start.getUTCSeconds() + +sDur);
          currentNewInRow++;
          newIdxToShow =
            newIdxToShow + 1 === newIdxs.length ? 0 : newIdxToShow + 1;
          currentOldInRow = 0;
        } else if (currentOldInRow < oldMaxInRow) {
          daySchedule[el].push({
            [timeOfSessionStart]: oldIdxs[currentOldInRow],
          });
          const [hDur, mDur, sDur] =
            oldIdxs[currentOldInRow].totalDuration.split(":");
          start.setUTCHours(start.getUTCHours() + +hDur);
          start.setUTCMinutes(start.getUTCMinutes() + +mDur);
          start.setUTCSeconds(start.getUTCSeconds() + +sDur);
          currentOldInRow++;
          if (currentOldInRow === oldMaxInRow) {
            currentNewInRow = 0;
            newIdxToShow = 0;
          }
        }
      }
      daySchedule[el].pop();
    }
    return daySchedule;
  });
  return arr;
};

const prepareSchedule = (films: Film[], start: Date, end: Date) => {
  if (!films.length) {
    return "Нет фильмов в прокате на эти даты";
  }
  console.log(films.length, "длина фильмов");

  const weekSchedule: string[] = [];
  while (start < end) {
    const keyDate = start.toISOString().split("T")[0];
    weekSchedule.push(keyDate);
    start.setUTCDate(start.getUTCDate() + 1);
  }
  if (films.length === 1) {
    return films[0].dataValues.endDate > end
      ? oneFilmSchedule(films[0].dataValues, start, end, weekSchedule)
      : oneFilmSchedule(films[0].dataValues, start, end, weekSchedule, true);
  } else {
    return multipleFilmsSchedule(films, start, end, weekSchedule);
  }
};

export const calculateSchedule: RequestHandler = async (req, res, next) => {
  const startSchedulePeriod = new Date();
  startSchedulePeriod.setUTCHours(0, 0, 0);
  startSchedulePeriod.setUTCDate(startSchedulePeriod.getUTCDate() + 6);
  const endSchedulePeriod = new Date();
  endSchedulePeriod.setUTCHours(23, 59, 59);
  endSchedulePeriod.setUTCDate(endSchedulePeriod.getUTCDate() + 12);
  const filmsToDistribute: Film[] = await receiveFilms(
    startSchedulePeriod,
    endSchedulePeriod
  );
  const schedule = prepareSchedule(
    filmsToDistribute,
    startSchedulePeriod,
    endSchedulePeriod
  );
  res.status(200).json(schedule);
};
