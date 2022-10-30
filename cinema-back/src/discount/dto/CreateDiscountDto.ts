import { Transform } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  name: string;

  @IsString()
  ageRestriction: string;

  @IsString()
  posterUrl: string;

  @IsString()
  description: string;

  @IsInt()
  @Transform(({ value }) => Number(value))
  discountPercentage: number;
}
