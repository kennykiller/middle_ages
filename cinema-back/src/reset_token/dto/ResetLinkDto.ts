import { IsString } from 'class-validator';

export class ResetLinkDto {
  @IsString()
  email: string;
}
