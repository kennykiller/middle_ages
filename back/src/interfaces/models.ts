export interface FilmModel {
  name: string;
  ageRestriction: string;
  posterUrl: string;
  startDate: string;
  endDate: string;
}
export interface Film {
  id?: number | undefined;
  name: string;
  ageRestriction: string;
  posterUrl: string;
  description: string;
  startDate: string;
  filmDuration: string;
  basePrice: number;
  genres: Genre[];
  endDate: string;
}
export interface Genre {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
export interface GenreCut {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
