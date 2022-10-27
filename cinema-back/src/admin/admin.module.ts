import { Module } from '@nestjs/common';
import { GenreModule } from '../genre/genre.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [GenreModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
