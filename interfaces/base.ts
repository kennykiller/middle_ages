import { Film, GenreCut } from "./models";
export interface FilmForSession extends Film {
  filmDuration: string;
  fullDay: boolean;
  genres: GenreCut[];
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
