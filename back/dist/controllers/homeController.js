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
exports.getDiscounts = void 0;
const discount_1 = __importDefault(require("../../models/discount"));
const ITEMS_PER_PAGE = 4;
const getDiscounts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = +req.query.page || 1;
    const offset = page === 1 ? 0 : page * ITEMS_PER_PAGE;
    const limitItems = offset ? ITEMS_PER_PAGE : ITEMS_PER_PAGE * 2;
    const discounts = yield discount_1.default.findAndCountAll({ limit: limitItems, offset });
    if (!discounts.count) {
        res.status(200).json('Акции не найдены.');
    }
    res.status(200).json(discounts);
});
exports.getDiscounts = getDiscounts;
