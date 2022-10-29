import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class GenericValidation implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    console.log(value, 'value in pipe');
    console.log(metatype, 'metatype');

    if (!metatype || !this.toValidate(metatype)) {
      console.log('in falsy metatype before return');

      return value;
    }
    const object = plainToInstance(metatype, value);
    console.log(object, 'object');

    const errors = await validate(object);

    console.log(errors, 'errors after validate object');

    if (errors.length > 0) {
      console.log('validation failed');
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    console.log('in to validate fn');
    console.log(metatype, 'metatype in toValidate fn');

    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
