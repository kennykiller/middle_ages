import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentStatus } from './payment_status.entity';
import { PaymentStatusService } from './payment_status.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentStatus])],
  providers: [PaymentStatusService],
  exports: [PaymentStatusService],
})
export class PaymentStatusModule {}
