import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { z } from 'zod';
// import { ZodSchema } from 'zod';

const test= (string):  { success: false; error: any; } | { success: true; data: any; } => {
  if(string === '1') {
    return {
      success: true, 
      data: []
    }
  
  }
  return {
    success: false, 
    error: []
  }
}

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
    const a = test('1')
    if(!a.success) {
      // throw new BadRequestException(a.error);
      throw new BadRequestException((a as {success: false; error: any;}).error);
    }

    return a.data;
  }
 
}
