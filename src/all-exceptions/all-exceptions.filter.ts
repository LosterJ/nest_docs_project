// import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
// import { HttpAdapterHost } from '@nestjs/core';

import { ArgumentsHost, Catch } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  
//   catch(exception: unknown, host: ArgumentsHost): void {
//     //In certain situations `httpAdapter` might not be available in the constructor method, thus we should resolve it here.
//     const { httpAdapter } = this.httpAdapterHost;

//     const ctx = host.switchToHttp();

//     const httpStatus = 
//       exception instanceof HttpException 
//         ? exception.getStatus() 
//         : HttpStatus.INTERNAL_SERVER_ERROR;

//     const responseBody = {
//       statusCode: httpStatus,
//       timestamp: new Date().toISOString(),
//       path: httpAdapter.getRequestUrl(ctx.getRequest()),
//     };

//     httpAdapter.reply(ctx.getResponse(),responseBody, httpStatus);
//   }
// }


@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
      super.catch(exception, host)
  }
  //This implementation is just a shell demonstrating the approach.
}