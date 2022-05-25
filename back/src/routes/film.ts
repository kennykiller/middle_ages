import { Router } from "express";
import {
  getFilms,
  getFilm,
  getUpcomingFilms,
} from "../controllers/filmController";
import { getSessions } from "../controllers/sessionsController";

const films = Router();

films.get("/", getFilms);
films.get("/upcoming", getUpcomingFilms);
films.post("/sessions/:id", getSessions);
films.get("/:id", getFilm);

export default films;
