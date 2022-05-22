"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sessionsController_1 = require("../../controllers/admin/sessionsController");
const adminSchedule = express_1.Router();
adminSchedule.post("/sessions", sessionsController_1.createSession);
adminSchedule.get("/sessions", sessionsController_1.calculateSchedule);
adminSchedule.post("/sessions-adjust", sessionsController_1.adjustSchedule);
exports.default = adminSchedule;
