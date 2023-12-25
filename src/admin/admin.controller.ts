import { Controller, Get } from '@nestjs/common';

@Controller({ host: 'admin.localhost' })
export class AdminController {
    @Get()
    index(): string {
        return 'Admin page alkdsjfjasd';
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