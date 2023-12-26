import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Param,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { CreateCatDto } from './dto/create-cat.dto';

@Controller('cats')
export class CatsController {
  @Post()
  @HttpCode(201) // The response status code is always 200 by default (POST: 201), we can change this behavior by adding the @HttpCode(...)
  //Your status code isn't static but depends on various factors -> Use a library-specific response (inject using @Res()).
  @Header('Content-Type', 'application/json') // Or use library-specific response object res.header() directly.
  async create(@Body() createCatDto: CreateCatDto) {
    return `Cat created with name: ${createCatDto.name}, age: ${createCatDto.age}, breed: ${createCatDto.breed}`;
  }
  //standard HTTP methods: @Get(), @Post(), @Put(), @Delete(), @Patch(), @Options(), @Head;
  //@All() defines an endpoint that handles all of them.

  @Get()
  async findAllAsync(): Promise<any[]> {
    return [];
  }
/*Every async function has to return a Promise. This above code is fully valid.*/
  @Get('observer')
  findAllObserve(): Observable<any[]> {
    return of([]);
  }
  /*
  Nest route handlers are even more powerfull being able to return RxJS observable streams.
  Nest will automatically subscribe to the source underneath and take the last emitted value (once the stram is completed).
  Both of the above approaches work and you can use whatever fits your requirements.
  */


  @Get('breed')
  findAll(): string {
    return 'This action returns all cats';
  }
  //@Get() tells Nest to create a handler for a specific end point (HTTP request method + route path)

  @Get('ab*cd')
  findAllWildcard() {
    return 'This route uses a wildcard';
  }
  /*
    Asterisk is used as a wildcard, and will mach any combination of characters.
    The characters ?, +, *, () may be used in a router path, and are subsets of their regular expression counterparts.
    The hyphen ( - ) and the dot ( . ) are interpreted literally by string-based paths.
    */
  // A wildcard in the middle of the route is only supported by express.

  @Get('nestjs')
  @Redirect('https://nestjs.com', 301)
  test() {}
  
  @Get('docs')
  getDocs() {
    return { url: 'https://docs.nestjs.com/providers' };
  }

  /*
  In order to define routes with parameters, we can add route parameter tokens in the path of the route to capture the dynamic value
  Route parameters declared in this way can be accessed using the @Param() decorator.
  */
  //   @Get(':id')
  //   findOne(@Param() params:any): string {
  //     console.log(params.id);
  //     return `This aciton returns a #${params.id} cat`;
  //   }
  //Routes with parameters should be declared after any static paths to prevent from intercepting traffic destined for the static paths.

  //You can also pass in a particular parameter token to the decorator, and then reference the route parameter directly by name in the method body.
  @Get(':id')
  findOne(@Param('id') id: number): string {
    return `This action return a #${id} cat`;
  }
}

/* 2 options for manipulating responses with Nest employs:
    - Standard (rcm): built-in method, when req handler returns:
        a JS object or array, it will automatically be serialized to JSON;
        a JS primitive type (e.g., string, number, boolean), it just be send the value without attempting to serialize it
        -> res handling simple: just return the value, Nest takes care of the rest.
    - Library-specific: can be injected using the @Res() decorator in the method handler signature (e.g., findAll(@Res() response))
        -> have the ability to use the native response handling methods exposed by that object (e.g. Express, response.status(200).send())
*/
