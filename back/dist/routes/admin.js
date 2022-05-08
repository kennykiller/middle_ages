"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const film_1 = __importDefault(require("./admin/film"));
const discount_1 = __importDefault(require("./admin/discount"));
const schedule_1 = __importDefault(require("./admin/schedule"));
const adminRouter = (0, express_1.Router)();
adminRouter.use('/admin', film_1.default);
adminRouter.use('/admin', schedule_1.default);
adminRouter.use('/admin', discount_1.default);
exports.default = adminRouter;
