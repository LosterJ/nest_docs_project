import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { TestModule } from './test/test.module';
import { AdminController } from './admin/admin.controller';
import { AccountController } from './account/account.controller';

@Module({
  imports: [TestModule],
  controllers: [AdminController, AppController, CatsController, AccountController],
  providers: [AppService],
})
export class AppModule {}

//We needed to attach the metadata to the module class using the @Module() decorator, and Nest can easily reflect which controllers have to be mounted.