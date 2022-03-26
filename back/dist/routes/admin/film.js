"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const filmController_1 = require("../../controllers/admin/filmController");
const adminFilms = express_1.Router();
exports.filmCreation = adminFilms.post('/film', filmController_1.createFilm);
exports.getGenres = adminFilms.get('/genres', filmController_1.getGenre);
