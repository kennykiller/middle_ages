import { Router } from "express";
import {
  getFilms,
  getFilm,
  getUpcomingFilms,
} from "../controllers/filmController";
import { getSessions, getSeats } from "../controllers/sessionsController";

const films = Router();

films.get("/", getFilms);
films.get("/upcoming", getUpcomingFilms);
films.post("/sessions/:id", getSessions);
films.get("/:id", getFilm);
films.get("/seats/:sessionId", getSeats);

export default films;
