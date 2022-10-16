import { Module } from '@nestjs/common';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { UsersModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, RefreshTokenModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
