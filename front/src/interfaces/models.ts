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
    posterUrl?: string;
  };
}

export interface Seat {
  id: number;
  number: number;
  created_at: string;
  updated_at: string;
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

export interface ExtendedSeat extends Seat {
  session: Session;
}
export interface User {
  email: string;
  id: number;
  isAdmin: boolean;
  name: string;
  phone: string;
  refreshToken: string;
}

export interface ExpandedUser extends User {
  userStatus: null | {
    id: number;
    name: string;
    endAmount: number;
    startAmount: number;
    discountPercentage: number;
  }
  orders: null | {
    id: number;
    created_at: string;
    updated_at: string;
  }[]
}