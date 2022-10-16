import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/CreateUserDto';
import { UsersService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenService } from '../refresh_token/refresh_token.service';
import { User } from '../user/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private refreshTokenService: RefreshTokenService,
  ) {}
  async signUp(createUserDto: CreateUserDto) {
    const userExists = await this.usersService.findOneByEmail(
      createUserDto.email,
    );
    if (userExists) {
      throw new BadRequestException('Пользователь уже существует.');
    }

    const newUser = await this.usersService.createUser(createUserDto);

    const tokens = await this.getTokens(newUser);
  }

  async getTokens(user: User) {
    const accessToken = 1;
    const refreshToken = this.refreshTokenService.createRefreshToken(user);
  }
}
