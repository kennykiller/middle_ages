"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const film_1 = require("./admin/film");
const router = express_1.Router();
router.use('/admin', film_1.filmCreation);
exports.default = router;
