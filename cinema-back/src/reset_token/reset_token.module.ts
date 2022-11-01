import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../user/user.module';
import { ResetToken } from './reset_token.entity';
import { ResetTokenService } from './reset_token.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResetToken]), UsersModule],
  providers: [ResetTokenService],
  exports: [ResetTokenService],
})
export class ResetTokenModule {}
