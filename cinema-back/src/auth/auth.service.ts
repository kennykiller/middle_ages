import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { CreateUserDto } from '../user/dto/CreateUserDto';

@Injectable()
export class AuthService {
  constructor(private User:User)
  createUser(dto: CreateUserDto) {
  }

  userExists(email: string) {

    //find existing user and use it in decorator
  }
}
