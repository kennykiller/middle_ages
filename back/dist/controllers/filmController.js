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
const film_1 = __importDefault(require("../../models/film"));
const genre_1 = __importDefault(require("../../models/genre"));
const ITEMS_PER_PAGE = 4;
exports.getFilms = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = req.query.page ? +req.query.page : 0;
    const offset = page ? page * ITEMS_PER_PAGE : 0;
    const films = yield film_1.default.findAndCountAll({ limit: ITEMS_PER_PAGE, offset, include: genre_1.default, distinct: true });
    if (!films.count) {
        res.status(200).json('Фильмы не найдены.');
    }
    // const { film?.dataValues?.id: lastFilmId } = await Film.findOne({ order: [ [ 'id', 'DESC' ]] });
    // const isLast = films.rows.find(film => film.id === lastFilmId);
    // const response: FilmsForVue = { films, isLast };
    res.status(200).json(films);
});
exports.getFilm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const film = yield film_1.default.findByPk(id);
    if (!film) {
        throw new Error('Фильм с таким ID не найден');
    }
    res.status(200).json({ film });
});
