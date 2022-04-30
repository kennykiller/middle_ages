"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const filmController_1 = require("../../controllers/admin/filmController");
const adminFilms = express_1.Router();
adminFilms.post('/film', filmController_1.createFilm);
adminFilms.get('/genres', filmController_1.getGenre);
exports.default = adminFilms;
