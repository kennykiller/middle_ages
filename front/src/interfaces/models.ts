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
export interface Discount {
  id?: number;
  name: string;
  ageRestriction: string;
  posterUrl: string;
  discountPercentage: number;
  description: string;
}

export interface Session {
  id: number;
  filmStart: string;
  seatsAvailable: number;
  price: number;
  film: {
    id: number;
  };
}

export interface Seat {
  id: number;
  number: number;
}

export interface ExpandedSeat extends Seat {
  order: {
    id: number | null;
    status?: {
      id: number;
      name: 'booked' | 'sold' | 'free';
    }
  }
}