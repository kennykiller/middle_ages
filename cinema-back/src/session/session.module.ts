import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmModule } from '../film/film.module';
import { SeatModule } from '../seat/seat.module';
import { Session } from './session.entity';
import { SessionService } from './session.service';

@Module({
  imports: [TypeOrmModule.forFeature([Session]), FilmModule, SeatModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
