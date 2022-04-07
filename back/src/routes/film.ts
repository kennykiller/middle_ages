import { Router } from 'express';
import { getFilms } from '../controllers/filmController';
import { getFilm } from '../controllers/filmController';

const films = Router();

films.get('/', getFilms); 
films.get('/:id', getFilm);

export default films;