"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const discountController_1 = require("../../controllers/admin/discountController");
const adminDiscounts = (0, express_1.Router)();
adminDiscounts.post('/discount', discountController_1.createDiscount);
exports.default = adminDiscounts;
