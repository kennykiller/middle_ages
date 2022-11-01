import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { UsersService } from '../user/user.service';
import { ResetToken } from './reset_token.entity';
import EmailHandler from '../utils/email';
import { ResetLinkDto } from './dto/ResetLinkDto';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import * as bcrypt from 'bcrypt';
import { ResetPassDto } from './dto/ResetPassDto';

@Injectable()
export class ResetTokenService {
  constructor(
    @InjectRepository(ResetToken)
    private resetTokenRepo: Repository<ResetToken>,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async createResetLink(dto: ResetLinkDto) {
    if (dto.email) {
      try {
        const user = await this.usersService.findOneByEmail(dto.email);
        if (!user) {
          throw new HttpException('Пользователь не найден', 404);
        }
        const existingToken = await this.resetTokenRepo.findOne({
          where: {
            user,
          },
        });

        if (existingToken) {
          await this.resetTokenRepo.delete({ user });
        }

        const resetToken = createHmac(
          'sha256',
          this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        )
          .update(dto.email)
          .digest('hex');
        const hash = await bcrypt.hash(resetToken, 10);
        const expiryDate = new Date();
        expiryDate.setMilliseconds(60 * 60 * 1000);
        const tokenToCreate = this.resetTokenRepo.create({
          user,
          token: hash,
          expiryDate,
        });
        await this.resetTokenRepo.save(tokenToCreate);
        console.log('after saving token');

        const link = `http://localhost:8080/password-reset?token=${resetToken}&id=${user.id}`;
        console.log(link, 'link');

        const emailHandler = new EmailHandler(
          dto.email,
          'reset',
          user.name,
          link,
        );
        emailHandler.sendMail();
        return {
          status: 200,
          message: 'Ссылка успешно отправлена на почту',
        };
      } catch (e) {
        console.log(e);
        throw new HttpException(
          { message: e.message },
          e.status || e.statusCode || 400,
        );
      }
    }
    throw new BadRequestException({ message: 'Email field was not sent' });
  }

  async resetPassword(resetPassDto: ResetPassDto) {
    try {
      const user = await this.usersService.findOne(resetPassDto.userId);
      const passwordResetToken = await this.resetTokenRepo.findOne({
        where: {
          user,
          expiryDate: MoreThan(new Date()),
        },
      });
      if (!passwordResetToken) {
        throw new BadRequestException(
          'Неверный либо просроченный токен сброса пароля!',
        );
      }
      const isValid = await bcrypt.compare(
        resetPassDto.token,
        passwordResetToken.token,
      );
      if (!isValid) {
        throw new BadRequestException(
          'Неверный либо просроченный токен сброса пароля!',
        );
      }
      const hashedPw = await bcrypt.hash(resetPassDto.password, 12);
      await this.usersService.updatePassword(hashedPw, user);
      await this.resetTokenRepo.delete({ user });
      return { message: 'Пароль успешно изменен.', success: true };
    } catch (e) {
      console.log(e);
      throw new HttpException(e, 400);
    }
  }
}
