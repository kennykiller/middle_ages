export interface Film {
  name: string;
  ageRestriction: string;
  posterUrl: string;
  description: string;
  startDate: string;
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
  name: string;
  ageRestriction: string;
  posterUrl: string;
  discountPercentage: number;
  description: string;
}
