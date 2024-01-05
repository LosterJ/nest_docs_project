import { Body, Get, HostParam, Post } from "@nestjs/common";
import { CatsService } from "src/cats/cats.service";

export class BaseController<I, D> {
  protected method = []
    constructor(private catsService: CatsService) {}
    // CatsService is injected through the class constructor.
    // private sysntax allows us to both declare and initialize the catsService member immediately in the same location.

 @Get("cats")
  async create(@Body() createCatDto: D) {
    return this.catsService.get();
  }

  @Get()
  async findAll(): Promise<I[]> {
    return [3] as I[];
  }
}