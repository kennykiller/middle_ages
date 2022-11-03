import { Transform } from 'class-transformer';
import { IsDateString, IsInt } from 'class-validator';

export class FindSessionDto {
  @IsInt()
  @Transform(({ value }) => Number(value))
  filmId: number;

  @IsDateString()
  date: string;
}
