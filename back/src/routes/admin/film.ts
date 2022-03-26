import { Router } from 'express';
import { createFilm, getGenre } from '../../controllers/admin/filmController';

const adminFilms = Router();

export const filmCreation = adminFilms.post('/film', createFilm);
export const getGenres = adminFilms.get('/genres', getGenre);