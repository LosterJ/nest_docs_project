import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
    .status(status)
    .json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    })

  }
}
  
/**
 * This filter is responsible for catching exceptions (an instance of the HttpException class), and implementing custom response logic for them.
 * To do this, we'll need to access the underlying platform Request and Response object.
 * - We'll access Request object to pull out the original url and include that in the logging information.
 * - We'll use the Response object to take direct control of the response that is sent, using response.json() method.
 */

/**
 * In catch() method, the exception parameter is the exception object currently being processed, the host parameter is an ArgumentsHost object.
 * We use ArgumentsHost to obtain a reference to the Request and Response objects that are being passed to the original request handler (in the controller where the exception originates)
 * We've used some helper methods on AgumentsHost to get the desired Request and Response objects.
 */