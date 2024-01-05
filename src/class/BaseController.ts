import { Body, Get, HostParam, Post } from "@nestjs/common";
import { CatsService } from "src/cats/cats.service";

export class BaseController<I, D> {
    constructor(private catsService: CatsService) {}
    // CatsService is injected through the class constructor.
    // private sysntax allows us to both declare and initialize the catsService member immediately in the same location.

 @Get("cats")
  async create(@Body() createCatDto: D) {
    return 1;
  }

  @Get()
  async findAll(): Promise<I[]> {
    return [3] as I[];
  }
}