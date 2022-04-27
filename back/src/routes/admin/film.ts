import { Router } from 'express';
import { createFilm, getGenre } from '../../controllers/admin/filmController';

const adminFilms = Router();

adminFilms.post('/film', createFilm);
adminFilms.get('/genres', getGenre);

export default adminFilms;