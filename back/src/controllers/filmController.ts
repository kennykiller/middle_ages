import { RequestHandler } from "express";
import { Op } from "sequelize";
import { Film as FilmModel } from "../models/film";
import { Genre } from "../models/genre";
import { Film } from "../interfaces/models";

const ITEMS_PER_PAGE = 4;
interface FilmsFromDB {
  rows: Film[];
  count: number;
}
export const getFilms: RequestHandler = async (req, res, next) => {
  try {
    const page: number = +req.query.page || 1;
    const offset: number = page === 1 ? 0 : page * ITEMS_PER_PAGE;
    const limitItems = offset ? ITEMS_PER_PAGE : ITEMS_PER_PAGE * 2;
    const films: FilmsFromDB = await FilmModel.findAndCountAll({
      limit: limitItems,
      offset,
      include: { model: Genre, through: { attributes: [] } },
      distinct: true,
    });
    if (!films.count) {
      throw new Error("Фильмы не найдены.");
    }
    res.status(200).json(films);
  } catch (e) {
    next(e);
  }
};

export const getUpcomingFilms: RequestHandler = async (req, res, next) => {
  try {
    const page: number = +req.query.page || 1;
    const offset: number = page === 1 ? 0 : page * ITEMS_PER_PAGE;
    const limitItems = offset ? ITEMS_PER_PAGE : ITEMS_PER_PAGE * 2;
    const d = new Date();
    const date = d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`;
    const month =
      d.getMonth() + 1 > 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
    const year = d.getFullYear();
    const fullDate = `${year}-${month}-${date}`;
    const films: FilmsFromDB = await FilmModel.findAndCountAll({
      where: { startDate: { [Op.gte]: fullDate } },
      limit: limitItems,
      offset,
      include: Genre,
      distinct: true,
    });
    if (!films.count) {
      throw new Error("Фильмы не найдены.");
    }
    res.status(200).json(films);
  } catch (e) {
    next(e);
  }
};

export const getFilm: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const film = await FilmModel.findByPk(id, {
      include: { model: Genre, through: { attributes: [] } },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!film) {
      throw new Error("Фильм с таким ID не найден");
    }

    const end = new Date(film.endDate);

    const endYear = end.getUTCFullYear();
    const endDate =
      end.getUTCDate() > 9 ? end.getUTCDate() : `0${end.getUTCDate()}`;
    const endMonth =
      end.getUTCMonth() + 1 > 9
        ? end.getUTCMonth() + 1
        : `0${end.getUTCMonth() + 1}`;
    const e = `${endYear}-${endMonth}-${endDate}`;
    const start = new Date(film.startDate);
    const startYear = start.getUTCFullYear();
    const startDate =
      start.getUTCDate() > 9 ? start.getUTCDate() : `0${start.getUTCDate()}`;
    const startMonth =
      start.getUTCMonth() + 1 > 9
        ? start.getUTCMonth() + 1
        : `0${start.getUTCMonth() + 1}`;
    const s = `${startYear}-${startMonth}-${startDate}`;
    res.status(200).json({ ...film.dataValues, endDate: e, startDate: s });
  } catch (e) {
    next(e);
  }
};
