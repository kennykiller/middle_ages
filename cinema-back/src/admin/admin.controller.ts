import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { IsAdminGuard } from '../common/guards/isAdmin.guard';
import { CreateFilmDto } from '../film/dto/CreateFilmDto';
import { AdminService } from './admin.service';
import { FilmService } from '../film/film.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../utils/file-upload';
import { GenericValidation } from '../pipes/GenericValidation.pipe';

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

  @Post('poster')
  @UseInterceptors(
    FileInterceptor('posterUrl', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, './src/assets/posters');
        },
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async savePoster(@UploadedFile() poster: Express.Multer.File) {
    if (poster?.path)
      return { message: 'Poster added', status: 201, url: poster.path };
    throw new BadRequestException({
      message: 'Empty or incorrect poster data sent',
    });
  }

  @Post('film')
  async createFilm(
    @Body(new ValidationPipe({ transform: true })) createFilmDto: CreateFilmDto,
  ) {
    console.log(createFilmDto, 'dto in post');
    return this.filmService.createFilm(createFilmDto);
  }
}
