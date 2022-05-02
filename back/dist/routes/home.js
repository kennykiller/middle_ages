"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const homeController_1 = require("../controllers/homeController");
const homeRouter = express_1.Router();
homeRouter.get('/discounts', homeController_1.getDiscounts);
exports.default = homeRouter;
