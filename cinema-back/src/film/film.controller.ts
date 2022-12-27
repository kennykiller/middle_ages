import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { FilmService } from './film.service';

@Controller('films')
export class FilmController {
  constructor(private filmService: FilmService) {}

  @Get('/all')
  async getFilms(@Query('page') page: string) {
    return this.filmService.getFilms(+page);
  }

  @Get('/upcoming')
  async getUpcomingFilms(@Query('page') page: string) {
    return this.filmService.getUpcomingFilms(+page);
  }

  @Get('/now')
  async getCurrentFilms(@Query('page') page: string) {
    return this.filmService.getCurrentFilms(+page);
  }

  @Get('/poster/:posterUrl')
  async servePoster(
    @Param('posterUrl') posterUrl: string,
    @Res() res: Response,
  ): Promise<any> {
    res.sendFile(join(process.cwd(), 'src/assets/posters', posterUrl));
  }

  @Get('/:id')
  async getFilm(@Param('id', ParseIntPipe) id: number) {
    return this.filmService.getFilm(id);
  }
}
