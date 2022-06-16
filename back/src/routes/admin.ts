import { Router } from "express";
import adminFilms from "./admin/film";
import adminDiscounts from "./admin/discount";
import adminSchedule from "./admin/schedule";
import { verifyToken } from "../authJwt";

const adminRouter = Router();

adminRouter.use("/admin", verifyToken, adminFilms);
adminRouter.use("/admin", verifyToken, adminSchedule);
adminRouter.use("/admin", verifyToken, adminDiscounts);

export default adminRouter;
