import { ExpandedSeat, User, Session } from "./models";
export interface CreateSessionResponse {
    message: string;
    createdSession: Session;
}

export interface SavedPosterResponse {
  data: {
    status: number;
    url: string;
    message: string;
  };
}

export interface FilmResponse {
    data: {
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
  }

  export interface DiscountResponse {
    data: {
      id: number;
      ageRestriction: string;
      description: string;
      discountPercentage: string;
      name: string;
      posterUrl: string;
      updatedAt: string;
    };
  }

  export interface SessionSeatsResponse {
    seats: ExpandedSeat[],
    session: {
      id: number;
      filmStart: string;
      seatsAvailable: number;
      price: number;
    }
  }