import { Transform } from 'class-transformer';
import { IsInt, ValidateNested } from 'class-validator';

export class CreateOrderDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  userId: number;

  @ValidateNested({ each: true })
  @IsInt()
  seats: number[];

  discountId: null;
}
