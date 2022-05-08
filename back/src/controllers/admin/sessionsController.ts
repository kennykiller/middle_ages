import { RequestHandler } from "express";
import { Op } from "sequelize";
import Film from "../../../models/film";
import Session from "../../../models/session";
import Genre from "../../../models/genre";

const ITEMS_PER_PAGE = 4;
interface FilmsAndCountFromDB {
  rows: Film[];
  count: number;
}
export const getFilms: RequestHandler = async (req, res, next) => {
  const page: number = +req.query.page || 1;
  const offset: number = page === 1 ? 0 : page * ITEMS_PER_PAGE;
  const limitItems = offset ? ITEMS_PER_PAGE : ITEMS_PER_PAGE * 2;
  const films: FilmsAndCountFromDB = await Film.findAndCountAll({
    limit: limitItems,
    offset,
    include: { model: Genre, through: { attributes: [] } },
    distinct: true,
  });
  if (!films.count) {
    res.status(200).json("Фильмы не найдены.");
  }
  res.status(200).json(films);
};

// export const createSession = async (filmId: number, startDate:string, endDate:string, duration: string) => {

//     await Session.bulkCreate();
// }

const receiveFilms = async (start:Date, end:Date):Promise<Film[]> => {
    console.log([start, end], 'startUTC', 'endUTC');
    
    const films:Film[] = await Film.findAll({
        where: {
            [Op.or]: [{
                startDate: {
                    [Op.between]: [start, end]
                }
            }, {
                endDate: {
                    [Op.between]: [start, end]
                }
            }, {
                [Op.and]: [
                    { startDate: {
                        [Op.lt]: start
                    } },
                    { endDate: {
                        [Op.gt]: end
                    }}
                ]
            }]
        },
        include: { model: Genre, attributes: { exclude: ["createdAt", "updatedAt"] }, through: { attributes: [] } },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        distinct: true,
    })
    return films;
}

const prepareSchedule = (films: Film[], start: Date, end: Date) => {
    console.log(films);
    if (!films.length) {
        return 'Нет фильмов в прокате на эти даты';
    }
    const weekSchedule = [];
    while (start < end) {
        start.setUTCDate(start.getUTCDate() + 1);
        const keyDate = start.toISOString().split('T')[0];
        weekSchedule.push(keyDate)
      }
    if (films.length === 1) {
        if (films[0].dataValues.endDate > end) {
            const [ hDur, mDur, sDur ] = films[0].dataValues.filmDuration.split(':');
            const arr = weekSchedule.map(el => {
                const daySchedule = {
                  [el]: []
                }
                const scheduleDate = el.split('-')[2]
                const start = new Date(el);
                start.setUTCDate(scheduleDate);
                start.setUTCHours(5, 0, 0, 0);
                const end = new Date(el);
                end.setUTCDate(scheduleDate);
                end.setUTCHours(23, 59, 59, 999);
                while(start < end) {
                    const hourOfStart = start.getHours() < 10 ? '0' + start.getHours() : String(start.getHours());
                    const minOfStart = start.getMinutes() < 10 ? '0' + start.getMinutes() : String(start.getMinutes());
                    const secOfStart = start.getSeconds() < 10 ? '0' + start.getSeconds() : String(start.getSeconds());
                    const timeOfSessionStart = `${hourOfStart}:${minOfStart}:${ secOfStart}`;
                    daySchedule[el].push({ [timeOfSessionStart]: films[0].dataValues });
                    start.setUTCHours(start.getUTCHours() + +hDur, +mDur + 15, +sDur);
                }
                return daySchedule;
              })
            return arr;
        }
    }
}

export const calculateSchedule:RequestHandler = async (req, res, next) => {    
    const startSchedulePeriod = new Date();
    startSchedulePeriod.setUTCHours(0, 0, 0);
    startSchedulePeriod.setUTCDate(startSchedulePeriod.getUTCDate() + 6);
    const endSchedulePeriod = new Date();
    endSchedulePeriod.setUTCHours(23, 59, 59);
    endSchedulePeriod.setUTCDate(endSchedulePeriod.getUTCDate() + 12);
    const filmsToDistribute: Film[] = await receiveFilms(startSchedulePeriod, endSchedulePeriod);
    prepareSchedule(filmsToDistribute, startSchedulePeriod, endSchedulePeriod);
    res.status(200).json(filmsToDistribute);
}

export const getUpcomingFilms: RequestHandler = async (req, res, next) => {
    const page: number = +req.query.page || 1;
    const offset: number = page === 1 ? 0 : page * ITEMS_PER_PAGE;
    const limitItems = offset ? ITEMS_PER_PAGE : ITEMS_PER_PAGE * 2;
    const d = new Date();
    const date = d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`;
    const month =
      d.getMonth() + 1 > 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
    const year = d.getFullYear();
    const fullDate = `${year}-${month}-${date}`;
    const films: FilmsAndCountFromDB = await Film.findAndCountAll({
      where: { startDate: { [Op.gte]: fullDate } },
      limit: limitItems,
      offset,
      include: Genre,
      distinct: true,
    });
    if (!films.count) {
      res.status(200).json("Фильмы не найдены.");
    }
    res.status(200).json(films);
  };