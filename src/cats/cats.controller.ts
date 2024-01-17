import { Body, Controller, Post , Get, Query, Param, HttpException, HttpStatus, BadRequestException, UseFilters, UsePipes, UseGuards } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
import { ForbiddenException } from 'src/forbidden/forbidden.exception';
import { HttpExceptionFilter } from 'src/http-exception/http-exception.filter';
import { ZodValidationPipe } from 'src/zod-validation/zod-validation.pipe';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';

@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {
  constructor(private catsService: CatsService) {}
  // CatsService is injected through the class constructor.
  // private sysntax allows us to both declare and initialize the catsService member immediately in the same location.

  // @Post()
  // @UseFilters(new HttpExceptionFilter())
  // async create(@Body() createCatDto: CreateCatDto) {
  //   try {
  //     this.catsService.create(createCatDto);
  //   } catch (error) {
  //     throw new ForbiddenException();
  //   }
  // }

  @Post()
  //@Roles(['admin'])
  async create(
    @Body(new ValidationPipe) createCatDto: CreateCatDto,
  ) {
    this.catsService.create(createCatDto);
  }

  //Use schema to valid
  // @Post()
  // @UsePipes(new ZodValidationPipe(createCatSchema))
  // async create(@Body() createCatDto: CreateCatDto) {
  //   this.catsService.create(createCatDto);
  // }

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