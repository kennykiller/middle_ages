import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/CreateUserDto';
import { User } from './user.entity';
import * as argon2 from 'argon2';
import { UpdateUserDto } from './dto/UpdateUserDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    try {
      const hashedPw = await argon2.hash(createUserDto.password);
      const isAdmin = createUserDto.name === process.env.ADMIN_NAME;
      const user = this.usersRepository.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPw,
        isAdmin,
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

  async update(userUpdateDto: UpdateUserDto): Promise<void> {
    const result = await this.usersRepository
      .createQueryBuilder()
      .update({
        refreshToken: userUpdateDto.refreshToken,
      })
      .where({ id: userUpdateDto.id })
      .returning('*')
      .execute();
    return result.raw[0];
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
