import { HttpException, Injectable } from '@nestjs/common';
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

  async createFilm(createFilmDto: CreateFilmDto) {
    const film = this.filmRepository.create({
      name: createFilmDto.name,
      ageRestriction: createFilmDto.ageRestriction,
      posterUrl: createFilmDto.posterUrl,
      description: createFilmDto.description,
      filmDuration: createFilmDto.filmDuration,
      basePrice: createFilmDto.basePrice,
      startDate: createFilmDto.startDate,
      endDate: new Date(createFilmDto.endDate.setUTCHours(23, 59, 59, 999)),
      genres: createFilmDto.genres,
    });
    try {
      const response = await this.filmRepository.save(film);
      return response;
    } catch (e) {
      throw new HttpException('Creation did not succeed', 400);
    }
  }
}
