import { Router } from 'express';
import { getFilms, getFilm } from '../controllers/filmController';

const films = Router();

films.get('/', getFilms); 
films.get('/:id', getFilm);

export default films;