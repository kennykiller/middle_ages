import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentStatus } from './payment_status.entity';

@Injectable()
export class PaymentStatusService {
  constructor(
    @InjectRepository(PaymentStatus)
    private statusRepo: Repository<PaymentStatus>,
  ) {}

  async getStatusByName(name: string) {
    return await this.statusRepo.findOne({ where: { name } });
  }
}
