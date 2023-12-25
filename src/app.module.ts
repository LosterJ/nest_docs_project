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
  //Van de xay ra khi AccountController dat truoc AppController, vi khi do no se coi localhost cung la tham so :accounts
  //neu de AccountController o sau AppController thi se khong nhan AccountController
  providers: [AppService],
})
export class AppModule {}
