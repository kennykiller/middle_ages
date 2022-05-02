"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const filmController_1 = require("../controllers/filmController");
const films = express_1.Router();
films.get('/', filmController_1.getFilms);
films.get('/upcoming', filmController_1.getUpcomingFilms);
films.get('/:id', filmController_1.getFilm);
exports.default = films;
