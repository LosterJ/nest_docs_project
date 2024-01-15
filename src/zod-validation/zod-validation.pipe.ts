import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { z } from 'zod';
// import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  // constructor(private schema: ZodSchema) {}

  // transform(value: unknown, metadata: ArgumentMetadata) {
  //   try {
  //     const parsedValue = this.schema.parse(value);
  //     return parsedValue;
  //   } catch (error) {
  //     throw new BadRequestException('Validation failed');
  //   }
  // }

  constructor(private readonly schema: z.ZodObject<any,any,any>) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const validationResult = this.schema.safeParse(value);
    
    if (validationResult.success) {
      return validationResult.data;
    } else {
      // throw new BadRequestException((validationResult.error))
      const SafeParseError = validationResult as z.SafeParseError<{ [x: string]: any }>;
      throw new BadRequestException(SafeParseError.error.errors);
    }
  }
 
}
