import { RequestHandler } from "express";
import Film from '../../models/film';
import Genre from '../../models/genre'
export const getFilms: RequestHandler = async (req, res, next) => {
    const films = await Film.findAll({include: Genre});
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