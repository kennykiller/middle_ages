import { Genre } from '../../genre/genre.entity';

export class CreateFilmDto {
  name: string;

  description: string;

  basePrice: number;

  ageRestriction: string;

  genres: Genre[];

  filmDuration: string;

  startDate: Date;

  endDate: Date;

  posterUrl: File;
}
