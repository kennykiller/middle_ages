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
const session_1 = __importDefault(require("../../models/session"));
exports.getSessions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    const dateStart = new Date(req.body.date).setUTCHours(0, 0, 0, 0);
    const dateEnd = new Date(req.body.date).setUTCHours(23, 59, 59, 999);
    const sessions = yield session_1.default.findAll({
        where: {
            filmId: id,
            filmStart: {
                [sequelize_1.Op.gte]: dateStart,
                [sequelize_1.Op.lte]: dateEnd,
            },
        },
        order: [["filmStart", "ASC"]],
        attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (!sessions) {
        throw new Error("Сеансы на эту дату не найдены");
    }
    res.status(200).json({ sessions });
});
