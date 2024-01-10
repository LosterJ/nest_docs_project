import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from './test/test.module';
import { HttpService } from './http/http.service';
import { AdminModule } from './admin/admin.module';
import { AccountModule } from './account/account.module';
import { ExampleModule } from './example/example.module';
import { LoggerMiddleware } from './logger/logger.middleware';

@Module({
  imports: [TestModule,  AdminModule, AccountModule, ExampleModule.register({ apiKey: 'your-api-key', apiUrl: 'your-api-url'})],
  controllers: [AppController],
  providers: [AppService, HttpService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
      consumer
      .apply(LoggerMiddleware)
      .forRoutes("cats");
  }
  //In the above example we have set up the LoggerMiddleware for the /cats route handlers that were prviously defined inside the CatsControler.
    
  /*
  We may also further restrict a middleware to a particular req method (passing an object containing the route path and req method to forRoutes() method):
    configure(consumer: MiddlewareConsumer) {
      consumer
      .apply(LoggerMiddleware)
      .forRoutes({path: 'cats', method: RequestMethod.GET})
    }
  */
}

//We needed to attach the metadata to the module class using the @Module() decorator, and Nest can easily reflect which controllers have to be mounted.