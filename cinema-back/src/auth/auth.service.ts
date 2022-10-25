import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/CreateUserDto';
import { UsersService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
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
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(signInData: AuthDto) {
    const user = await this.usersService.findOneByEmail(signInData.email);
    if (!user) {
      throw new BadRequestException('Пользователя не существует.');
    }
    const passwordsMatched = await bcrypt.compare(
      signInData.password,
      user.password,
    );
    if (!passwordsMatched) {
      throw new BadRequestException('Введен неверный пароль.');
    }
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return { ...user, ...tokens };
  }

  async logout(userId: number) {
    return this.usersService.updateRefreshToken(userId, null);
  }

  async getTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
        },
        {
          secret: this.configService.get('ACCESS_TOKEN_SECRET'),
          expiresIn: `${this.configService.get('ACCESS_TOKEN_EXPIRATION')}s`,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
        },
        {
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
          expiresIn: `${this.configService.get('REFRESH_TOKEN_EXPIRATION')}s`,
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: number, token: string) {
    const hashedToken = await this.hashData(token);
    await this.usersService.updateRefreshToken(userId, hashedToken);
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Доступ запрещен.');
    }
    const refreshTokenMatches = await bcrypt.compare(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Доступ запрещен.');
    }
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  hashData(dataToHash: string) {
    return bcrypt.hash(dataToHash, 10);
  }
}
