import { RequestHandler } from "express";
import Discount from "../../../models/discount";
import { ErrorException } from "../../interfaces/events";

export const createDiscount:RequestHandler = async (
  req, res, next
) => {
  console.log(req, 'request');
  
  const discountData = req.body;
  if (!req.file) {
    const error: ErrorException = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }
  console.log(req.file);

  const imageUrl: string = req.file.path;
  const discount = await Discount.create({
    name: discountData.name,
    ageRestriction: discountData.ageRestriction,
    posterUrl: imageUrl,
    description: discountData.description,
    discountPercentage: discountData.discountPercentage
  });
  
  res.status(201).json({ message: "Discount added.", createdDiscount: discount });
};
