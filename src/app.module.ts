import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from './test/test.module';
import { HttpService } from './http/http.service';
import { AdminModule } from './admin/admin.module';
import { AccountModule } from './account/account.module';
import { ExampleModule } from './example/example.module';

@Module({
  imports: [TestModule,  AdminModule, AccountModule, ExampleModule.register({ apiKey: 'your-api-key', apiUrl: 'your-api-url'})],
  controllers: [AppController],
  providers: [AppService, HttpService],
})
export class AppModule {}

//We needed to attach the metadata to the module class using the @Module() decorator, and Nest can easily reflect which controllers have to be mounted.