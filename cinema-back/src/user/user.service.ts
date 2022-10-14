import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/CreateUserDto';
import { User } from './user.entity';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const hashedPw = await bcrypt.hash(createUserDto.password, 12);
    const isAdmin = createUserDto.name === process.env.ADMIN_NAME;
    const user = await this.usersRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPw,
      isAdmin,
    });
    await this.usersRepository.save(user);
    delete user.password;
    return user;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
