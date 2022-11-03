import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  Brackets,
  createQueryBuilder,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { CreateFilmDto } from './dto/CreateFilmDto';
import { Film } from './film.entity';
import { unlink } from 'fs/promises';
import { User } from '../user/user.entity';

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

  async getFilm(id: number) {
    try {
      const film = await this.filmRepository.findOne({
        relations: ['genres'],
        where: { id },
      });

      if (!film) {
        throw new NotFoundException('film do not exist');
      }
      const end = new Date(film.endDate);

      const endYear = end.getUTCFullYear();
      const endDate =
        end.getUTCDate() > 9 ? end.getUTCDate() : `0${end.getUTCDate()}`;
      const endMonth =
        end.getUTCMonth() + 1 > 9
          ? end.getUTCMonth() + 1
          : `0${end.getUTCMonth() + 1}`;
      const e = `${endYear}-${endMonth}-${endDate}`;
      const start = new Date(film.startDate);
      const startYear = start.getUTCFullYear();
      const startDate =
        start.getUTCDate() > 9 ? start.getUTCDate() : `0${start.getUTCDate()}`;
      const startMonth =
        start.getUTCMonth() + 1 > 9
          ? start.getUTCMonth() + 1
          : `0${start.getUTCMonth() + 1}`;
      const s = `${startYear}-${startMonth}-${startDate}`;

      return { ...film, endDate: e, startDate: s };
    } catch {
      throw new HttpException('Internal error', 500);
    }
  }

  async getFilmWithoutModify(id: number) {
    const film = await this.filmRepository.findOne({
      where: { id },
    });
    return film;
  }

  async getFilmsByPeriod(start: Date, end: Date) {
    try {
      const films = await this.filmRepository
        .createQueryBuilder()
        .where(
          new Brackets((qb) => {
            qb.where('startDate >= :start', { start }).andWhere(
              'startDate <= :end',
              { end },
            );
          }),
        )
        .orWhere(
          new Brackets((qb) => {
            qb.where('endDate >= :start', { start }).andWhere(
              'endDate <= :end',
              {
                end,
              },
            );
          }),
        )
        .orWhere(
          new Brackets((qb) => {
            qb.where('startDate <= :start', { start }).andWhere(
              'endDate >= :end',
              { end },
            );
          }),
        )
        .getMany();
      return films;
    } catch (e) {
      throw new HttpException('Error occured, try later', 400);
    }
  }
}
