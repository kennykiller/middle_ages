import { Transform } from 'class-transformer';
import { IsInt, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  userId: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  sessionId: number;

  @IsNumber({}, { each: true })
  seats: number[];

  discountId: null;
}
