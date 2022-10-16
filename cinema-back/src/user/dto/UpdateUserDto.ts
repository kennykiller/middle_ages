import { IsEmail } from 'class-validator';

export class UpdateUserDto {
  id: number;
  refreshToken: string;
  @IsEmail()
  email: string;
}
