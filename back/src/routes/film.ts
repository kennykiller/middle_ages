import { Router } from 'express';
import { getFilms, getFilm, getUpcomingFilms } from '../controllers/filmController';

const films = Router();

films.get('/', getFilms); 
films.get('/upcoming', getUpcomingFilms);
films.get('/:id', getFilm);

export default films;