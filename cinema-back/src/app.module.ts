import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import dbConfig from 'db/db-config';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './auth/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './auth/strategies/refreshToken.strategy';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { MulterModule } from '@nestjs/platform-express';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    AuthModule,
    AdminModule,
    OrderModule,
    JwtModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register(),
  ],
  providers: [AccessTokenStrategy, RefreshTokenStrategy],
})
export class AppModule {}
