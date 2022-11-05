import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStatus } from './user_status.entity';
import { UserStatusService } from './user_status.service';

@Module({
  providers: [UserStatusService],
  imports: [TypeOrmModule.forFeature([UserStatus])],
  exports: [UserStatusService],
})
export class UserStatusModule {}
