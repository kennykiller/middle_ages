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
const sequelize_1 = require("sequelize");
const film_1 = __importDefault(require("../../models/film"));
const genre_1 = __importDefault(require("../../models/genre"));
const ITEMS_PER_PAGE = 4;
exports.getFilms = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = +req.query.page || 1;
    const offset = page === 1 ? 0 : page * ITEMS_PER_PAGE;
    const limitItems = offset ? ITEMS_PER_PAGE : ITEMS_PER_PAGE * 2;
    const films = yield film_1.default.findAndCountAll({
        limit: limitItems,
        offset,
        include: { model: genre_1.default, through: { attributes: [] } },
        distinct: true,
    });
    if (!films.count) {
        res.status(200).json("Фильмы не найдены.");
    }
    res.status(200).json(films);
});
exports.getUpcomingFilms = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = +req.query.page || 1;
    const offset = page === 1 ? 0 : page * ITEMS_PER_PAGE;
    const limitItems = offset ? ITEMS_PER_PAGE : ITEMS_PER_PAGE * 2;
    const d = new Date();
    const date = d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`;
    const month = d.getMonth() + 1 > 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
    const year = d.getFullYear();
    const fullDate = `${year}-${month}-${date}`;
    const films = yield film_1.default.findAndCountAll({
        where: { startDate: { [sequelize_1.Op.gte]: fullDate } },
        limit: limitItems,
        offset,
        include: genre_1.default,
        distinct: true,
    });
    if (!films.count) {
        res.status(200).json("Фильмы не найдены.");
    }
    res.status(200).json(films);
});
exports.getFilm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const film = yield film_1.default.findByPk(id, {
        include: { model: genre_1.default, through: { attributes: [] } },
        attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    console.log(film);
    if (!film) {
        throw new Error("Фильм с таким ID не найден");
    }
    res.status(200).json({ film });
});
