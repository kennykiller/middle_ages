import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { IsAdminGuard } from '../common/guards/isAdmin.guard';
import { CreateFilmDto } from '../film/dto/CreateFilmDto';
import { AdminService } from './admin.service';
import { FilmService } from '../film/film.service';

@Controller('admin')
@UseGuards(AccessTokenGuard, IsAdminGuard)
export class AdminController {
  constructor(
    private adminService: AdminService,
    private filmService: FilmService,
  ) {}

  @Get('genres')
  getGenres() {
    return this.adminService.getGenres();
  }

  @Post()
  create(@Body() createFilmDto: CreateFilmDto) {
    return this.filmService.createFilm(createFilmDto);
  }
}
