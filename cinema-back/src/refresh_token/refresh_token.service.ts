import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh_token.entity';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/user.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}
  async createRefreshToken(user: User) {
    const expiredAt = new Date();
    expiredAt.setSeconds(
      expiredAt.getSeconds() + +process.env.REFRESH_TOKEN_EXPIRATION,
    );
    const _token = uuidv4();
    const hashedToken = await argon2.hash(_token);
    const refreshToken = this.refreshTokenRepository.create({
      token: hashedToken,
      user,
      expiryDate: expiredAt.getTime(),
    });
    await this.refreshTokenRepository.save(refreshToken);
    return _token;
  }
}
