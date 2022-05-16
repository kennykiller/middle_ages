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
export interface FilmResponse {
  data: {
    createdFilm: {
      id: number;
      ageRestriction: string;
      description: string;
      createdAt: string;
      name: string;
      posterUrl: string;
      updatedAt: string;
      startDate: string;
      endDate: string;
    };
    message: string;
  };
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
export interface DiscountResponse {
  data: {
    createdDiscount: {
      id: number;
      ageRestriction: string;
      description: string;
      discountPercentage: string;
      name: string;
      posterUrl: string;
      updatedAt: string;
    };
    message: string;
  };
}
export interface Discount {
  id: number | undefined;
  name: string;
  ageRestriction: string;
  posterUrl: string;
  discountPercentage: number;
  description: string;
}
