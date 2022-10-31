import { Transform } from 'class-transformer';
import { IsDate, IsInt } from 'class-validator';

export class CreateSessionDto {
  @IsDate()
  @Transform(({ value }) => new Date(value))
  filmStart: Date;

  @IsInt()
  @Transform(({ value }) => Number(value))
  price: number;

  @IsInt()
  @Transform(({ value }) => Number(value))
  filmId: number;
}
