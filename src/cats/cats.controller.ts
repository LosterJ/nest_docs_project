import { Body, Controller, Post , Get, Query, Param } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}
  // CatsService is injected through the class constructor.
  // private sysntax allows us to both declare and initialize the catsService member immediately in the same location.

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}

/*
  In the example below, Nest will resolve the catsService by creating and returning an instance of CatsService.
  Or, in the normal case of a singleton, returning the existing instance if it has already been requested elsewhere.
  This dependency is resolved and passed to your controller's constructor.
*/