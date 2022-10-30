import { Module } from '@nestjs/common';
import { DiscountModule } from '../discount/discount.module';
import { FilmModule } from '../film/film.module';
import { GenreModule } from '../genre/genre.module';
import { UsersModule } from '../user/user.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [GenreModule, UsersModule, FilmModule, DiscountModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
