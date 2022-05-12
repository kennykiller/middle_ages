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
  const filmData = req.body;
  if (!req.file) {
    const error: ErrorException = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }

  const startDate = new Date(filmData.startDate);
  const endDate = new Date(filmData.endDate);
  endDate.setUTCHours(23, 59, 59, 999);

  const imageUrl: string = req.file.path;
  const film = await Film.create({
    name: filmData.name,
    ageRestriction: filmData.ageRestriction,
    posterUrl: imageUrl,
    description: filmData.description,
    filmDuration: filmData.filmDuration,
    startDate: startDate,
    endDate: endDate,
  });
  
  const filmGenresIds: { genreId: number, filmId: number }[] = JSON.parse(filmData.genres).map(genre => {
    return { genreId: genre.id, filmId: film.dataValues.id }
  });
  await FilmGenres.bulkCreate(filmGenresIds);
  // await createSession(film.dataValues.id, film.dataValues.startDate, film.dataValues.endDate, film.dataValues.filmDuration);
  res.status(201).json({ message: "Film added.", createdFilm: film });
};

export const getGenre: RequestHandler = async (req, res, next) => {
  const genres = await Genre.findAll();
  res.status(200).json({ genres });
};
