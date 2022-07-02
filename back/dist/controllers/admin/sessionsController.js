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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const film_1 = require("../../models/film");
const session_1 = require("../../models/session");
const genre_1 = require("../../models/genre");
const time_calculation_1 = require("../../util/time-calculation");
const schedule_creator_1 = require("../../util/schedule-creator");
const ITEMS_PER_PAGE = 4;
exports.verifyCreationPossibility = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const startSchedulePeriod = new Date();
    startSchedulePeriod.setUTCHours(0, 0, 0);
    startSchedulePeriod.setUTCDate(startSchedulePeriod.getUTCDate() + 6);
    const endSchedulePeriod = new Date();
    endSchedulePeriod.setUTCHours(23, 59, 59);
    endSchedulePeriod.setUTCDate(endSchedulePeriod.getUTCDate() + 12);
    try {
        const existingSchedule = yield session_1.Session.findOne({
            where: {
                filmStart: { [sequelize_1.Op.between]: [startSchedulePeriod, endSchedulePeriod] },
            },
        });
        if (existingSchedule) {
            return res
                .status(400)
                .send({ message: "На эти даты расписание уже создано" });
        }
        else {
            req.body.startSchedulePeriod = startSchedulePeriod;
            req.body.endSchedulePeriod = endSchedulePeriod;
            next();
        }
    }
    catch (e) {
        return res.status(500).send({ message: e, details: "Серверная ошибка" });
    }
});
exports.createSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filmStart = req.body.filmStart;
    const { price } = req.body;
    const filmId = req.body.id;
    const session = yield session_1.Session.create({
        filmStart,
        price,
        filmId,
    });
    res.status(201).json({ message: "Сеанс добавлен.", createdFilm: session });
});
const receiveFilms = (start, end) => __awaiter(void 0, void 0, void 0, function* () {
    const films = yield film_1.Film.findAll({
        where: {
            [sequelize_1.Op.or]: [
                {
                    startDate: {
                        [sequelize_1.Op.between]: [start, end],
                    },
                },
                {
                    endDate: {
                        [sequelize_1.Op.between]: [start, end],
                    },
                },
                {
                    [sequelize_1.Op.and]: [
                        {
                            startDate: {
                                [sequelize_1.Op.lt]: start,
                            },
                        },
                        {
                            endDate: {
                                [sequelize_1.Op.gt]: end,
                            },
                        },
                    ],
                },
            ],
        },
        include: {
            model: genre_1.Genre,
            attributes: { exclude: ["createdAt", "updatedAt"] },
            through: { attributes: [] },
        },
        attributes: {
            exclude: ["createdAt", "updatedAt", "description", "posterUrl"],
        },
        distinct: true,
    });
    return films;
});
const calculateTime = (start, mode) => {
    return mode === "local"
        ? new time_calculation_1.LocalTime(start).timeOfStart
        : new time_calculation_1.UTCTime(start).timeOfStart;
};
const oneFilmSchedule = (film, scheduleArr, filmEndsBeforeSchedule = false) => {
    const filmScheduleCreator = new schedule_creator_1.oneFilmScheduleCreator(scheduleArr, film, filmEndsBeforeSchedule);
    filmScheduleCreator.durationCount(film);
    const arr = scheduleArr.map((el) => {
        const daySchedule = {
            [el]: [],
        };
        filmScheduleCreator.setSchedule(el);
        if (filmEndsBeforeSchedule && filmScheduleCreator.start > film.endDate) {
            return daySchedule;
        }
        while (filmScheduleCreator.start < filmScheduleCreator.end) {
            const timeOfSessionStart = calculateTime(filmScheduleCreator.start, "local");
            daySchedule[el].push({ [timeOfSessionStart]: film });
            filmScheduleCreator.postponeStart();
        }
        daySchedule[el].pop();
        return daySchedule;
    });
    return arr;
};
const prepareSchedule = (films, start, end) => {
    if (!films.length) {
        return "Нет фильмов в прокате на эти даты";
    }
    const weekSchedule = [];
    while (start < end) {
        const keyDate = start.toISOString().split("T")[0];
        weekSchedule.push(keyDate);
        start.setUTCDate(start.getUTCDate() + 1);
    }
    if (films.length === 1) {
        return films[0].endDate > end
            ? oneFilmSchedule(films[0], weekSchedule)
            : oneFilmSchedule(films[0], weekSchedule, true);
    }
    else {
        const multipleCreator = new schedule_creator_1.multipleFilmsScheduleCreator(films, weekSchedule);
        return multipleCreator.setupBase();
    }
};
exports.calculateSchedule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { startSchedulePeriod, endSchedulePeriod } = req.body;
    try {
        const receivedFilms = yield receiveFilms(startSchedulePeriod, endSchedulePeriod);
        const filmsToDistribute = receivedFilms.map((el) => el.dataValues);
        const schedule = prepareSchedule(filmsToDistribute, startSchedulePeriod, endSchedulePeriod);
        res.status(200).json(schedule);
    }
    catch (e) {
        return res.status(500).send({ message: e, details: "Серверная ошибка" });
    }
});
exports.adjustSchedule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const arr = req.body; //массив фильмов, надо пересчитать время начала фильмов в зависимости от общей продолжительности и установить прайс
    const startOfSession = new Date();
    startOfSession.setHours(8, 0, 0, 0);
    const recalculatedSchedule = arr.map((session) => {
        const timeOfSessionStart = new time_calculation_1.LocalTime(startOfSession).timeOfStart;
        //пересчитанное время начала сеанса
        const hourOfSessionStart = startOfSession.getHours();
        const basePrice = Object.values(session)[0]
            .basePrice;
        const price = hourOfSessionStart < 12
            ? basePrice * 0.85
            : hourOfSessionStart >= 18
                ? basePrice * 1.15
                : basePrice;
        const [hDur, mDur, sDur] = Object.values(session)[0].totalDuration.split(":");
        startOfSession.setHours(startOfSession.getHours() + +hDur);
        startOfSession.setMinutes(startOfSession.getMinutes() + +mDur);
        startOfSession.setSeconds(startOfSession.getSeconds() + +sDur);
        return {
            [timeOfSessionStart]: Object.assign(Object.assign({}, Object.values(session)[0]), { price }),
        };
    });
    res.status(200).json(recalculatedSchedule);
});
