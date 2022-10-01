import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { CreateUserDto } from './dto/CreateUserDto';

@Injectable()
export class AuthService {
  createUser(dto: CreateUserDto) {
  }

  userExists() {
    //find existing user and use it in decorator
  }
}
