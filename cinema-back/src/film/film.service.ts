import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFilmDto } from './dto/CreateFilmDto';
import { Film } from './film.entity';

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
  ) {}

  async createFilm(createFilmDto: CreateFilmDto) {}
}
