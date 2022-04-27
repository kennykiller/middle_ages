import { RequestHandler } from "express";
import Discount from '../../models/discount';
export const getDiscounts: RequestHandler = async (req, res, next) => {
    const id = req.params.id;
    const discounts = await Discount.findAll();
    // if (!discounts.length) {
    //     throw new Error('Фильм с таким ID не найден');
    // }
    console.log(discounts);
    
    res.status(200).json({ discounts });
}