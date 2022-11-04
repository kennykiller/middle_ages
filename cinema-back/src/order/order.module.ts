import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountModule } from '../discount/discount.module';
import { SeatModule } from '../seat/seat.module';
import { PaymentStatusModule } from '../status/payment_status.module';
import { UsersModule } from '../user/user.module';
import { OrdersController } from './order.controller';
import { Order } from './order.entity';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    SeatModule,
    UsersModule,
    PaymentStatusModule,
    DiscountModule,
  ],
  controllers: [OrdersController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
