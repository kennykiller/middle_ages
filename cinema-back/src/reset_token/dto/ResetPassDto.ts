import { Transform } from 'class-transformer';
import { IsInt, IsString, MinLength } from 'class-validator';
import { Match } from '../../utils/match.decorator';

export class ResetPassDto {
  @IsString()
  token: string;

  @IsInt()
  @Transform(({ value }) => Number(value))
  userId: number;

  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  @IsString()
  password: string;

  @Match(ResetPassDto, (s) => s.password)
  passwordConfirmation: string;
}
