import { Router } from "express";
import {
  calculateSchedule,
  adjustSchedule,
  createSession,
  verifyCreationPossibility,
} from "../../controllers/admin/sessionsController";

const adminSchedule = Router();

adminSchedule.post("/sessions", createSession);
adminSchedule.get("/sessions", verifyCreationPossibility, calculateSchedule);
adminSchedule.post("/sessions-adjust", adjustSchedule);

export default adminSchedule;
