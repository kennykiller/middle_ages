import { RequestHandler } from "express";
import Film from '../../models/film';
import Genre from '../../models/genre';

const ITEMS_PER_PAGE = 4;

export const getFilms: RequestHandler = async (req, res, next) => {
    const page:number = req.query.page ? +req.query.page : 0;
    const offset: number = page ? page * ITEMS_PER_PAGE : 0;
    const films = await Film.findAndCountAll({ limit: ITEMS_PER_PAGE, offset, distinct: true, include: Genre });
    res.status(200).json({ films })
}

export const getFilm: RequestHandler = async (req, res, next) => {
    const id = req.params.id;
    const film = await Film.findByPk(id);
    if (!film) {
        throw new Error('Фильм с таким ID не найден');
    }
    res.status(200).json({ film });
}