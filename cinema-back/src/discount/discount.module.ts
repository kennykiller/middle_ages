import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountController } from './discount.controller';
import { Discount } from './discount.entity';
import { DiscountService } from './discount.service';

@Module({
  imports: [TypeOrmModule.forFeature([Discount])],
  controllers: [DiscountController],
  providers: [DiscountService],
  exports: [DiscountService],
})
export class DiscountModule {}
