import { Transform, Type } from 'class-transformer';
import { IsDate, IsInt, IsString, ValidateNested } from 'class-validator';
import { Genre } from '../../genre/genre.entity';

export class CreateFilmDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  @Transform(({ value }) => Number(value))
  basePrice: number;

  @IsString()
  ageRestriction: string;

  @ValidateNested({ each: true })
  @Type(() => Genre)
  genres: Genre[];

  @IsString()
  filmDuration: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  endDate: Date;

  @IsString()
  posterUrl: string;

  @IsString()
  posterUrlBig: string;
}
