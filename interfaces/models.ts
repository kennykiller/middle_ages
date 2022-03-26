export interface Film {
  name: string;
  ageRestriction: string;
  posterUrl: string;
  startDate: string;
  genres: Genre[];
  endDate: string;
}
export interface Genre {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
