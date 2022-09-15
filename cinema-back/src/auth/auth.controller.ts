import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUserDto';

@Controller('auth')
export class AuthController {
  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto) {
    return 'new user added';
  }
}
