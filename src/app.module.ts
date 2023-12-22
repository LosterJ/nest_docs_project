import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { TestModule } from './test/test.module';

@Module({
  imports: [TestModule],
  controllers: [AppController, CatsController],
  providers: [AppService],
})
export class AppModule {}
