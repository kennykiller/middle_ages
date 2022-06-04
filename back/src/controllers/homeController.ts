import { RequestHandler } from "express";
import { Discount } from "../models/discount";

const ITEMS_PER_PAGE = 4;
interface DiscountsFromDB {
  rows: Discount[];
  count: number;
}
export const getDiscounts: RequestHandler = async (req, res, next) => {
  const page: number = +req.query.page || 1;
  const offset: number = page === 1 ? 0 : page * ITEMS_PER_PAGE;
  const limitItems = offset ? ITEMS_PER_PAGE : ITEMS_PER_PAGE * 2;
  const discounts: DiscountsFromDB = await Discount.findAndCountAll({
    limit: limitItems,
    offset,
  });
  if (!discounts.count) {
    res.status(200).json("Акции не найдены.");
  }
  res.status(200).json(discounts);
};
