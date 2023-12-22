import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
    @Get('breed')
    findAll(): string {
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