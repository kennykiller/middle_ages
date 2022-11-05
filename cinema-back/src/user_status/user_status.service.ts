import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStatus } from './user_status.entity';

@Injectable()
export class UserStatusService {
  constructor(
    @InjectRepository(UserStatus)
    private userStatusRepo: Repository<UserStatus>,
  ) {}

  async getDefaultStatus() {
    return await this.userStatusRepo.findOne({
      where: {
        startAmount: 0,
      },
    });
  }
}
