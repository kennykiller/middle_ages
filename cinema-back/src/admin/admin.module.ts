import { Module } from '@nestjs/common';
import { GenreModule } from '../genre/genre.module';
import { UsersModule } from '../user/user.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [GenreModule, UsersModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
