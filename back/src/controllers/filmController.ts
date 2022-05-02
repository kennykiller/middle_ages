import { RequestHandler } from "express";
import { Op } from "sequelize";
import Film from "../../models/film";
import Genre from "../../models/genre";

const ITEMS_PER_PAGE = 4;
interface FilmsFromDB {
  rows: Film[];
  count: number;
}
export const getFilms: RequestHandler = async (req, res, next) => {
  const page: number = +req.query.page || 1;
  const offset: number = page === 1 ? 0 : page * ITEMS_PER_PAGE;
  const limitItems = offset ? ITEMS_PER_PAGE : ITEMS_PER_PAGE * 2;
  const films: FilmsFromDB = await Film.findAndCountAll({
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
  const films: FilmsFromDB = await Film.findAndCountAll({
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

export const getFilm: RequestHandler = async (req, res, next) => {
  const id = req.params.id;
  const film = await Film.findByPk(id);
  if (!film) {
    throw new Error("Фильм с таким ID не найден");
  }
  res.status(200).json({ film });
};
