import { Controller, Get, HostParam, Redirect } from '@nestjs/common';

@Controller({ host: ':account' })
export class AccountController {
    @Get()
    getInfo(@HostParam('account') account: string): string {
        return account;
    }
}

/*
    Similer to route path, the host option can use tokens to capture the dynamic value at that position in the host name.
    The host parameters declared in this way can be accessed using the @HostParam() decorator, which should be added to the method signature.
*/

