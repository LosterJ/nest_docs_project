import { Controller, Get, HostParam } from '@nestjs/common';
import { CatsService } from 'src/cats/cats.service';
import { Cat } from 'src/cats/interfaces/cat.interface';

@Controller({ host: ':account' })
export class AccountController {
    constructor(private readonly catsService: CatsService) {}

    @Get("cats")
    async findAll(): Promise<Cat[]> {
        return this.catsService.findAll();
    }

    @Get()
    getInfo(@HostParam('account') account: string): string {
        console.log({account})
        return account;
    }
}

/*
    Similer to route path, the host option can use tokens to capture the dynamic value at that position in the host name.
    The host parameters declared in this way can be accessed using the @HostParam() decorator, which should be added to the method signature.
*/

