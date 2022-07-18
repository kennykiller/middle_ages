import { Router } from "express";
import { getSeats } from "../controllers/orderController";

const orderRouter = Router();

orderRouter.get("/seats", getSeats);

export default orderRouter;
