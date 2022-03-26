import { Router } from 'express';
import { getFilms } from '../controllers/filmController';

const adminFilms = Router();

export const getHomeData = adminFilms.get('/', getFilms); 