"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sessionsController_1 = require("../../controllers/admin/sessionsController");
const adminSchedule = express_1.Router();
// adminSchedule.post('/sessions', createSession);
adminSchedule.get('/sessions', sessionsController_1.calculateSchedule);
exports.default = adminSchedule;
