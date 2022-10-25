import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/CreateUserDto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    try {
      const hashedPw = await bcrypt.hash(createUserDto.password, 10);
      const isAdmin =
        createUserDto.name === this.configService.get<string>('ADMIN_NAME');
      const user = this.usersRepository.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPw,
        phone: createUserDto.phone,
        isAdmin,
        refreshToken: createUserDto.refreshToken,
      });
      await this.usersRepository.save(user);
      delete user.password;
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

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
