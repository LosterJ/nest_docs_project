import { Controller, Get, Req, Res } from '@nestjs/common';
import { response } from 'express';

@Controller('cats')
export class CatsController {
    @Get('breed')
    findAll(@Req() request: Request, @Res() response: Response): string {
        return 'This action returns all cats';
    }
    //@Get() tells Nest to create a handler for a specific end point (HTTP request method + route path)
}

/* 2 options for manipulating responses with Nest employs:
    - Standard (rcm): built-in method, when req handler returns:
        a JS object or array, it will automatically be serialized to JSON;
        a JS primitive type (e.g., string, number, boolean), it just be send the value without attempting to serialize it
        -> res handling simple: just return the value, Nest takes care of the rest.
    - Library-specific: can be injected using the @Res() decorator in the method handler signature (e.g., findAll(@Res() response))
        -> have the ability to use the native response handling methods exposed by that object (e.g. Express, response.status(200).send())
*/

/* Dedicated decorators:
    @Request(), @Req()          req
    @Response(), @Res()         res
    @Next()                     next
    @Session()                  req.session
    @Param(key?: string)        req.params/req.params[key]
    @Body(key?: string)         req.body/req.body[key]
    @Query(key?: string)        req.query/req.query[key]
    @Headers(name?: string)     req.header/req.header[name]
    @Ip()                       req.ip
    @HostParam()                req.hosts

    When inject @Res(),... in method handler -> put Nest into Library-specific mode for that handler -> become responsible for managing the response
    -> MUST issue some kind of response by making a call on the response object (e.g., res.json(...), res.send(...)) or the HTTP server will HANG.
*/

/*Nest detects when the handler using library-specific.
  If both approaches are used at the same time, the Standrad approach is automatically disabled for this single route and no longer work as expected.
  To use both approaches at the same time (for example, by injecting the res object to only set cookies/headers but still leave the rest to the framework),
  MUST set like this: @Res({ passthrough: true }) in @Res decorator.
*/