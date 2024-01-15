import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype,value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
  toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

/*
- The transform() method is marked as async <- some of the class-validator validations can be async-Promise.
  (Nest supports both sync and async pipes)
- We're using destructuring { metatype } to extract the metatype field (just member from an ArgumentMetadata) in to our metatype parameter.
  (This is just shorthand for getting the full ArgumentMetadata and then having an additional statement to assign the metatype variable)
- The helper function toValidate() is responsible for bypassing the validation step when the current argument being processed is native JS type.
  (these can't have validation decorators attached, so there's no reason to run them through the validation step)
- The class-transformer function plainToInstance() to transform our plain JS argument object into a typed object so that we can apply validation
  |<- the incoming post body object, when desirialized from the network request, does not have any type information (the way the underlying platform as Express works).
- Since this is a validationpipe it either returns the value unchanged, or throws an exception.
*/