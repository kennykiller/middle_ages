import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import dbConfig from 'db/db-config';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
