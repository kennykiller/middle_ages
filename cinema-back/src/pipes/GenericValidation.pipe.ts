import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { unlink } from 'fs/promises';
import { CreateDiscountDto } from '../discount/dto/CreateDiscountDto';
import { CreateFilmDto } from '../film/dto/CreateFilmDto';

@Injectable()
export class GenericValidation implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length) {
      if (
        object instanceof CreateFilmDto ||
        object instanceof CreateDiscountDto
      ) {
        await unlink(object.posterUrl);
      }
      throw new BadRequestException({
        validationErrors: errors,
        message: 'validation failed',
      });
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
