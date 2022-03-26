import { Request, Response, NextFunction, RequestHandler } from "express";
import Film from "../../../models/film";
import Genre from "../../../models/genre";
import FilmGenres from "../../../models/film_genres";
import { ErrorException } from "../../interfaces/events";

export const createFilm = async (
  req: Express.Multer.File & Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req, 'request');
  
  const filmData = req.body;
  if (!req.file) {
    const error: ErrorException = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }
  console.log(req.file);

  const imageUrl: string = req.file.path;
  const film = await Film.create({
    name: filmData.name,
    ageRestriction: filmData.ageRestriction,
    posterUrl: imageUrl,
    startDate: filmData.startDate,
    endDate: filmData.endDate,
  });
  
  const filmGenresIds: { genreId: number, filmId: number }[] = JSON.parse(filmData.genres).map(genre => {
    return { genreId: genre.id, filmId: film.dataValues.id }
  });
  await FilmGenres.bulkCreate(filmGenresIds);
  res.status(201).json({ message: "Film added.", createdFilm: film });
};

export const getGenre: RequestHandler = async (req, res, next) => {
  const genres = await Genre.findAll();
  res.status(200).json({ genres });
};
