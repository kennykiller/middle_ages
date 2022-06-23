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
const setPrice = (start, arr, arrToPush, key, timeOfSessionStart, idx) => {
    if (start.getHours() < 12) {
        const reducedPrice = arr[idx].basePrice * 0.85;
        arrToPush[key].push({
            [timeOfSessionStart]: Object.assign(Object.assign({}, arr[idx]), { price: reducedPrice }),
        });
    }
    else if (start.getHours() > 18) {
        const increasedPrice = arr[idx].basePrice * 1.15;
        arrToPush[key].push({
            [timeOfSessionStart]: Object.assign(Object.assign({}, arr[idx]), { price: increasedPrice }),
        });
    }
    else {
        arrToPush[key].push({
            [timeOfSessionStart]: Object.assign(Object.assign({}, arr[idx]), { price: arr[idx].basePrice }),
        });
    }
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
const multipleFilmsSchedule = (films, scheduleArr) => {
    const arr = scheduleArr.map((el) => {
        const daySchedule = {
            [el]: [],
        };
        const scheduleDate = el.split("-")[2];
        const start = new Date(el);
        start.setUTCDate(+scheduleDate);
        start.setUTCHours(5, 0, 0, 0); //настроеная дата для каждого нового рабочего дня
        const adjustedFilms = films.map((film) => {
            //фильмы, с добавленными полями для проверки возраста и новый фильм или нет
            const [hDur, mDur, sDur] = film.filmDuration.split(":");
            const d = new Date();
            d.setUTCHours(+hDur, +mDur + 15, +sDur);
            const totalDuration = calculateTime(d, "utc");
            const dateForOldCheck = new Date(film.startDate);
            dateForOldCheck.setUTCDate(dateForOldCheck.getUTCDate() + 6);
            const fullDay = parseInt(film.ageRestriction, 10) > 11;
            return Object.assign(Object.assign({}, film), { totalDuration, isOld: dateForOldCheck <= start, fullDay });
        });
        const end = new Date(el);
        end.setUTCDate(+scheduleDate);
        end.setUTCHours(23, 59, 59, 999); //настроенная дата для окончания рабочего дня
        if (
        //фильмы либо новые, либо старые с одинаковой возрастной категорией
        adjustedFilms.every((film) => !film.isOld && film.fullDay) ||
            adjustedFilms.every((film) => !film.isOld && !film.fullDay) ||
            adjustedFilms.every((film) => film.isOld && film.fullDay) ||
            adjustedFilms.every((film) => film.isOld && !film.fullDay)) {
            let currentIdx = 0;
            const { length } = adjustedFilms;
            while (start < end) {
                const timeOfSessionStart = calculateTime(start, "local");
                setPrice(start, adjustedFilms, daySchedule, el, timeOfSessionStart, currentIdx);
                const [hDur, mDur, sDur] = adjustedFilms[currentIdx].totalDuration.split(":");
                start.setUTCHours(start.getUTCHours() + +hDur);
                start.setUTCMinutes(start.getUTCMinutes() + +mDur);
                start.setUTCSeconds(start.getUTCSeconds() + +sDur);
                currentIdx = currentIdx + 1 === length ? 0 : currentIdx + 1;
            }
            daySchedule[el].pop();
        }
        if (
        //один фильм новый, а другой старый, но возрастные категории совпадают, чередование 2-1-2
        adjustedFilms.some((film) => film.isOld) &&
            adjustedFilms.some((film) => !film.isOld) &&
            (adjustedFilms.every((film) => film.fullDay) ||
                adjustedFilms.every((film) => !film.fullDay))) {
            const oldIdxs = adjustedFilms.filter((film) => film.isOld);
            const newIdxs = adjustedFilms.filter((film) => !film.isOld);
            const newMaxInRow = 2 * newIdxs.length;
            const oldMaxInRow = oldIdxs.length;
            let currentOldInRow = 0;
            let currentNewInRow = 0;
            let newIdxToShow = 0;
            while (start < end) {
                const timeOfSessionStart = calculateTime(start, "local");
                if (currentNewInRow < newMaxInRow) {
                    setPrice(start, newIdxs, daySchedule, el, timeOfSessionStart, newIdxToShow);
                    const [hDur, mDur, sDur] = adjustedFilms[newIdxToShow].totalDuration.split(":");
                    start.setUTCHours(start.getUTCHours() + +hDur);
                    start.setUTCMinutes(start.getUTCMinutes() + +mDur);
                    start.setUTCSeconds(start.getUTCSeconds() + +sDur);
                    currentNewInRow++;
                    newIdxToShow =
                        newIdxToShow + 1 === newIdxs.length ? 0 : newIdxToShow + 1;
                    currentOldInRow = 0;
                }
                else if (currentOldInRow < oldMaxInRow) {
                    setPrice(start, oldIdxs, daySchedule, el, timeOfSessionStart, currentOldInRow);
                    const [hDur, mDur, sDur] = oldIdxs[currentOldInRow].totalDuration.split(":");
                    start.setUTCHours(start.getUTCHours() + +hDur);
                    start.setUTCMinutes(start.getUTCMinutes() + +mDur);
                    start.setUTCSeconds(start.getUTCSeconds() + +sDur);
                    currentOldInRow++;
                    if (currentOldInRow === oldMaxInRow) {
                        currentNewInRow = 0;
                        newIdxToShow = 0;
                    }
                }
            }
            daySchedule[el].pop();
        }
        else if ((adjustedFilms.every((film) => !film.isOld) ||
            adjustedFilms.every((film) => film.isOld)) &&
            adjustedFilms.some((film) => film.fullDay) &&
            adjustedFilms.some((film) => !film.fullDay)) {
            //разная возрастная категория, оба новых или оба старых
            let currentIdx = 0;
            const adultFilms = adjustedFilms.filter((film) => film.fullDay);
            let currentAdultIdx = 0;
            const { length } = adjustedFilms;
            while (start < end) {
                const timeOfSessionStart = calculateTime(start, "local");
                if (start.getUTCHours() > 18 || start.getHours() < 3) {
                    setPrice(start, adultFilms, daySchedule, el, timeOfSessionStart, currentAdultIdx);
                    const [hDur, mDur, sDur] = adultFilms[currentAdultIdx].totalDuration.split(":");
                    start.setUTCHours(start.getUTCHours() + +hDur);
                    start.setUTCMinutes(start.getUTCMinutes() + +mDur);
                    start.setUTCSeconds(start.getUTCSeconds() + +sDur);
                    currentAdultIdx =
                        ++currentAdultIdx === adultFilms.length ? 0 : currentAdultIdx++;
                }
                else {
                    setPrice(start, adjustedFilms, daySchedule, el, timeOfSessionStart, currentIdx);
                    const [hDur, mDur, sDur] = adjustedFilms[currentIdx].totalDuration.split(":");
                    start.setUTCHours(start.getUTCHours() + +hDur);
                    start.setUTCMinutes(start.getUTCMinutes() + +mDur);
                    start.setUTCSeconds(start.getUTCSeconds() + +sDur);
                    currentIdx = currentIdx + 1 === length ? 0 : currentIdx + 1;
                }
            }
            daySchedule[el].pop();
        }
        else {
            //один новый, другой старый и разные возрастные категории
            const oldIdxs = adjustedFilms.filter((film) => film.isOld);
            const newIdxs = adjustedFilms.filter((film) => !film.isOld);
            const newMaxInRow = 2 * newIdxs.length;
            const oldMaxInRow = oldIdxs.length;
            let currentOldInRow = 0;
            let currentNewInRow = 0;
            let newIdxToShow = 0;
            let currentAdultIdx = 0;
            const adultFilms = adjustedFilms.filter((film) => film.fullDay);
            while (start < end) {
                const timeOfSessionStart = calculateTime(start, "local");
                if (start.getHours() > 18 || start.getHours() < 3) {
                    setPrice(start, adultFilms, daySchedule, el, timeOfSessionStart, currentAdultIdx);
                    const [hDur, mDur, sDur] = adultFilms[currentAdultIdx].totalDuration.split(":");
                    start.setUTCHours(start.getUTCHours() + +hDur);
                    start.setUTCMinutes(start.getUTCMinutes() + +mDur);
                    start.setUTCSeconds(start.getUTCSeconds() + +sDur);
                    currentAdultIdx =
                        ++currentAdultIdx === adultFilms.length ? 0 : currentAdultIdx++;
                }
                else if (currentNewInRow < newMaxInRow) {
                    setPrice(start, newIdxs, daySchedule, el, timeOfSessionStart, newIdxToShow);
                    const [hDur, mDur, sDur] = newIdxs[newIdxToShow].totalDuration.split(":");
                    start.setUTCHours(start.getUTCHours() + +hDur);
                    start.setUTCMinutes(start.getUTCMinutes() + +mDur);
                    start.setUTCSeconds(start.getUTCSeconds() + +sDur);
                    currentNewInRow++;
                    newIdxToShow =
                        newIdxToShow + 1 === newIdxs.length ? 0 : newIdxToShow + 1;
                    currentOldInRow = 0;
                }
                else if (currentOldInRow < oldMaxInRow) {
                    setPrice(start, oldIdxs, daySchedule, el, timeOfSessionStart, currentOldInRow);
                    const [hDur, mDur, sDur] = oldIdxs[currentOldInRow].totalDuration.split(":");
                    start.setUTCHours(start.getUTCHours() + +hDur);
                    start.setUTCMinutes(start.getUTCMinutes() + +mDur);
                    start.setUTCSeconds(start.getUTCSeconds() + +sDur);
                    currentOldInRow++;
                    if (currentOldInRow === oldMaxInRow) {
                        currentNewInRow = 0;
                        newIdxToShow = 0;
                    }
                }
            }
            daySchedule[el].pop();
        }
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
        return multipleFilmsSchedule(films, weekSchedule);
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
