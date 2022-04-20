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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const film_1 = __importDefault(require("../../../models/film"));
const genre_1 = __importDefault(require("../../../models/genre"));
const film_genres_1 = __importDefault(require("../../../models/film_genres"));
exports.createFilm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req, 'request');
    const filmData = req.body;
    if (!req.file) {
        const error = new Error("No image provided.");
        error.statusCode = 422;
        throw error;
    }
    console.log(req.file);
    const imageUrl = req.file.path;
    const film = yield film_1.default.create({
        name: filmData.name,
        ageRestriction: filmData.ageRestriction,
        posterUrl: imageUrl,
        description: filmData.description,
        startDate: filmData.startDate,
        endDate: filmData.endDate,
    });
    const filmGenresIds = JSON.parse(filmData.genres).map(genre => {
        return { genreId: genre.id, filmId: film.dataValues.id };
    });
    yield film_genres_1.default.bulkCreate(filmGenresIds);
    res.status(201).json({ message: "Film added.", createdFilm: film });
});
exports.getGenre = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const genres = yield genre_1.default.findAll();
    res.status(200).json({ genres });
});
