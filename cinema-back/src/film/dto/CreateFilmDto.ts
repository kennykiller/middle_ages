import { IsArray, IsDate, IsInt, IsString } from 'class-validator';
import { Genre } from '../../genre/genre.entity';

export class CreateFilmDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  basePrice: number;

  @IsString()
  ageRestriction: string;

  @IsArray()
  genres: Genre[];

  @IsString()
  filmDuration: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;
}
