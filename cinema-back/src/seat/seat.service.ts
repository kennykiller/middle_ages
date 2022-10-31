import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSeatDto } from './dto/CreateSeatDto';
import { Seat } from './seat.entity';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private seatRepo: Repository<Seat>,
  ) {}
  async createSeats(seatData: CreateSeatDto) {
    const requests = [];
    for (let i = 1; i < 101; i++) {
      requests.push(
        this.seatRepo.save(
          this.seatRepo.create({
            number: i,
            session: seatData.session,
            order: null,
          }),
        ),
      );
    }
    try {
      await Promise.all(requests);
    } catch {
      throw new HttpException('Could not add seats to session', 400);
    }
  }
}
