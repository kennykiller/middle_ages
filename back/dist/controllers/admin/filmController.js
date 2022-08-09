"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGenre = exports.createFilm = void 0;
const film_1 = require("../../models/film");
const genre_1 = require("../../models/genre");
const film_genres_1 = require("../../models/film_genres");
const createFilm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filmData = req.body;
    if (!req.file) {
        const error = new Error("No image provided.");
        error.statusCode = 422;
        throw error;
    }
    const startDate = new Date(filmData.startDate);
    const endDate = new Date(filmData.endDate);
    endDate.setUTCHours(23, 59, 59, 999);
    const imageUrl = req.file.path;
    const film = yield film_1.Film.create({
        name: filmData.name,
        ageRestriction: filmData.ageRestriction,
        posterUrl: imageUrl,
        description: filmData.description,
        filmDuration: filmData.filmDuration,
        basePrice: +filmData.basePrice,
        startDate: startDate,
        endDate: endDate,
    });
    const filmGenresIds = JSON.parse(filmData.genres).map((genre) => {
        return { genreId: genre.id, filmId: film.dataValues.id };
    });
    yield film_genres_1.FilmGenres.bulkCreate(filmGenresIds);
    res.status(201).json({ message: "Film added.", createdFilm: film });
});
exports.createFilm = createFilm;
const getGenre = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const genres = yield genre_1.Genre.findAll();
    res.status(200).json({ genres });
});
exports.getGenre = getGenre;
