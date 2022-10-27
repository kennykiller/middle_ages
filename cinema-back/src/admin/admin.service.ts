import { Injectable } from '@nestjs/common';
import { GenreService } from '../genre/genre.service';

@Injectable()
export class AdminService {
  constructor(private genreService: GenreService) {}

  async getGenres() {
    return this.genreService.getGenres();
  }
}
