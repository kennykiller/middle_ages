import { RequestHandler } from "express";
import Film from '../../models/film';
import Genre from '../../models/genre'
export const getFilms: RequestHandler = async (req, res, next) => {
    const films = await Film.findAll({include: Genre});
    res.status(200).json({ films })
}