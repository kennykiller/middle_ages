import { Router } from "express";
import { createDiscount } from "../../controllers/admin/discountController";

const adminDiscounts = Router();
adminDiscounts.post('/discount', createDiscount);

export default adminDiscounts;