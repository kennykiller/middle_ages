import { IsEmail, MinLength } from 'class-validator';
import { Match } from 'src/utils/match.decorator';

export class CreateUserDto {
  @IsEmail({ message: 'Пожалуйста, введите валидный email' })
  email: string;

  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  password: string;

  @Match(CreateUserDto, (s) => s.password)
  passwordConfirmation: string;

  name: string;
}
