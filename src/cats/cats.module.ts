import { Global, Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

//@Global() //provide a set of providers which should be available everywhere out-of-the-box
/**
 * @Globle() decorator makes the module global-scoped.
 * Global modules should be registered only once, generally
 */
@Module({
    controllers: [CatsController],
    providers: [CatsService],
    exports: [CatsService]
    /* Any module that import CatsModule has access to the CatsService
    and will share the same instance with all other modules that import it as well.*/
})
export class CatsModule {
    //constructor(private catsService: CatsService) {}
    //Dependency injection
}
