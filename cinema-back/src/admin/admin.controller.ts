import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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

  @Post('film')
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
  async create(
    @UploadedFile() poster: Express.Multer.File,
    @Body(new GenericValidation()) createFilmDto: CreateFilmDto,
  ) {
    console.log(poster, 'poster');

    console.log(createFilmDto, 'dto in post');
    return this.filmService.createFilm(createFilmDto);
  }
}
