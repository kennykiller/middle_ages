import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  createUser() {}

  userExists() {
    //find existing user and use it in decorator
  }
}
