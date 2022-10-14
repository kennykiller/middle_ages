import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/CreateUserDto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto) {
    this.authService.createUser(createUserDto);
  }
}
