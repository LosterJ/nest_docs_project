import { Body, Controller, Post , Get, Query, Param, HttpException, HttpStatus, BadRequestException, UseFilters } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
import { ForbiddenException } from 'src/forbidden/forbidden.exception';
import { HttpExceptionFilter } from 'src/http-exception/http-exception.filter';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}
  // CatsService is injected through the class constructor.
  // private sysntax allows us to both declare and initialize the catsService member immediately in the same location.

  @Post()
  @UseFilters(new HttpExceptionFilter())
  async create(@Body() createCatDto: CreateCatDto) {
    try {
      this.catsService.create(createCatDto);
    } catch (error) {
      throw new ForbiddenException();
    }
    

  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get('exception')
  async throwException() {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    //HttpStatus (helper enum)
  }

  @Get('optionException')
  async throwOException() {
    try {
      await this.catsService.findAll()
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'This is a custom message',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error
        }
      )
    }
  }

  @Get('customException')
  async customException() {
    throw new ForbiddenException();
    throw new BadRequestException('Something bad happend', { cause: new Error(), description: 'Some error description'})
  }

}

/*
  In the example below, Nest will resolve the catsService by creating and returning an instance of CatsService.
  Or, in the normal case of a singleton, returning the existing instance if it has already been requested elsewhere.
  This dependency is resolved and passed to your controller's constructor.
*/