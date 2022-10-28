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

  async createFilm(createFilmDto: CreateFilmDto) {
    console.log(createFilmDto, 'dto');
    // if (!createFilmDto.posterUrl) {
    //     const error: ErrorException = new Error("No image provided.");
    //     error.statusCode = 422;
    //     throw error;
    // }

    // const startDate = new Date(filmData.startDate);
    // const endDate = new Date(filmData.endDate);
    // endDate.setUTCHours(23, 59, 59, 999);

    // const imageUrl: string = req.file.path;
    // const film = await Film.create({
    //     name: filmData.name,
    //     ageRestriction: filmData.ageRestriction,
    //     posterUrl: imageUrl,
    //     description: filmData.description,
    //     filmDuration: filmData.filmDuration,
    //     basePrice: +filmData.basePrice,
    //     startDate: startDate,
    //     endDate: endDate,
    // });

    // const filmGenresIds: { genreId: number; filmId: number }[] = JSON.parse(
    //     filmData.genres
    // ).map((genre) => {
    //     return { genreId: genre.id, filmId: film.dataValues.id };
    // });
    // await FilmGenres.bulkCreate(filmGenresIds);
    // res.status(201).json({ message: "Film added.", createdFilm: film });
  }
}
