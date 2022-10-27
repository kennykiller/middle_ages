import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { IsAdminGuard } from '../common/guards/isAdmin.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AccessTokenGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('genres')
  getGenres() {
    return this.adminService.getGenres();
  }
}
