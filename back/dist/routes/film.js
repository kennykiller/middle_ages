"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const filmController_1 = require("../controllers/filmController");
const adminFilms = express_1.Router();
exports.getHomeData = adminFilms.get('/', filmController_1.getFilms);
