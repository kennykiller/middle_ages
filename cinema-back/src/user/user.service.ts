import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/CreateUserDto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import EmailHandler from '../utils/email';
import { UserStatusService } from '../user_status/user_status.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
    private userStatusService: UserStatusService,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    try {
      const hashedPw = await bcrypt.hash(createUserDto.password, 10);
      const isAdmin =
        createUserDto.name === this.configService.get<string>('ADMIN_NAME');
      const defaultStatus = await this.userStatusService.getDefaultStatus();
      const user = this.usersRepository.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPw,
        phone: createUserDto.phone,
        isAdmin,
        refreshToken: createUserDto.refreshToken,
        userStatus: defaultStatus,
      });
      const createdUser = await this.usersRepository.save(user);
      delete createdUser.password;
      const emailHandler = new EmailHandler(
        createdUser.email,
        'welcome',
        createdUser.name,
      );
      emailHandler.sendMail();
      return user;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async findOneDetailed(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
      relations: {
        userStatus: true,
        orders: true,
      },
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  async updateRefreshToken(userId: number, hashedToken: string | null) {
    try {
      await this.usersRepository
        .createQueryBuilder()
        .update({
          refreshToken: hashedToken,
        })
        .where({ id: userId })
        .execute();
    } catch (e) {
      throw new Error(e);
    }
  }

  async updatePassword(password: string, user: User) {
    await this.usersRepository.update({ id: user.id }, { password });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
