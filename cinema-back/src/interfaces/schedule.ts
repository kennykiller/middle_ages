import { Film } from '../film/film.entity';
import { Genre } from '../genre/genre.entity';

export interface FilmForSession extends Film {
  price: number;
  filmDuration: string;
  fullDay: boolean;
  genres: Genre[];
  id: number;
  isOld: boolean;
  totalDuration: string;
}

export interface DailySchedule {
  [prop: string]: FilmForSession; //08:00:00, 09:25:00
}

export interface Schedules {
  [prop: string]: DailySchedule[]; //2022-05-21, 2022-05-22
}
