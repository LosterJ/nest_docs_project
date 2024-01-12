import { HttpException, HttpStatus } from "@nestjs/common";

export class ForbiddenException extends HttpException {
    constructor() {
        super('Forbidden', HttpStatus.FORBIDDEN);
    }
}
//Since ForbiddenException extends the base HttpException,
//it will work seamlessly with the built-in exception handler, and therefore we can use it inside the findAll() method.