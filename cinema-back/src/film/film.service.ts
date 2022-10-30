import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { CreateFilmDto } from './dto/CreateFilmDto';
import { Film } from './film.entity';
import { unlink } from 'fs/promises';

@Injectable()
export class FilmService {
  private ITEMS_PER_PAGE = 4;

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
      const createdFilm = await this.filmRepository.save(film);
      return createdFilm;
    } catch (e) {
      await unlink(createFilmDto.posterUrl);
      throw new HttpException('Creation did not succeed', 400);
    }
  }

  async getFilms(page = 1) {
    const offset: number = +page === 1 ? 0 : page * this.ITEMS_PER_PAGE;
    const limitItems = offset ? this.ITEMS_PER_PAGE : this.ITEMS_PER_PAGE * 2;
    try {
      const [films, count] = await this.filmRepository.findAndCount({
        take: limitItems,
        skip: offset,
        relations: {
          genres: true,
        },
      });
      return { films, count };
    } catch {
      throw new HttpException('Films were not found, try later', 400);
    }
  }

  async getUpcomingFilms(page = 1) {
    const offset: number = +page === 1 ? 0 : page * this.ITEMS_PER_PAGE;
    const limitItems = offset ? this.ITEMS_PER_PAGE : this.ITEMS_PER_PAGE * 2;
    const d = new Date();
    const date = d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`;
    const month =
      d.getMonth() + 1 > 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
    const year = d.getFullYear();
    const fullDate = `${year}-${month}-${date}`;
    try {
      const [films, count] = await this.filmRepository.findAndCount({
        take: limitItems,
        skip: offset,
        relations: {
          genres: true,
        },
        where: { startDate: MoreThanOrEqual(new Date(fullDate)) },
      });
      return { films, count };
    } catch {
      throw new HttpException('Upcoming films were not found, try later', 400);
    }
  }
}
