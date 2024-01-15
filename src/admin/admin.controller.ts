import { Controller, Get, Param } from '@nestjs/common';
import { CatsService } from 'src/cats/cats.service';
import { ParseIntPipe } from 'src/parse-int/parse-int.pipe';

// import test from '../cats/dto/create-cat.dto';
// import * as testb  from '../cats/dto/create-cat.dto';
// import {createCatSchema} from '../cats/dto/create-cat.dto';
@Controller({ host: 'admin.localhost' })
export class AdminController {
    constructor(private readonly catsService: CatsService) {}

    @Get()
    index(): string {
        // const x = {
        //     a: 1, b: 2, c12323:3 , d: 4, e: 5
        // }
        // const {b, c12323} = x;
        // // const a = x.a;
        // // const b= x.b
        // console.log("🚀 ~ AdminController ~ index ~ b:", b)
        // const {b:as ,e, ...y} = x
        // console.log("🚀 ~ AdminController ~ index ~ y:", y)
        // const {a: testa, b: testb} = x;
        //  // const testa = x.a;
        // // const testb = x.b
        // console.log("🚀 ~ AdminController ~ index ~ testb:", testb)
        // console.log("🚀 ~ AdminController ~ index ~ testa:", testa)
        
        return 'Admin page alkdsjfjasd';
    }
    @Get(':id')
    async findOneTwoThree(@Param('id',new ParseIntPipe) id) {
        return id;
        return this.catsService.findAll();
    }
}

/*
Express and Fastify don't have build-in filtering by hostname.
What this @Controller({ host: ':admin' }) essentially does is wrapping all your route handlers within a condition, which compares the hostname.
However, if your routes without hostname specified overlap with those which you have under your "hostname"-sepecific controller + they were registered first,
there's no reason to skip them. They will be simply evaluated first and will never hit the second controller.
link: https://github.com/nestjs/nest/issues/4670

The @Controller decorator can take a 'host' option to require that the HTTP host of the incoming requests matches some specific value.
*/