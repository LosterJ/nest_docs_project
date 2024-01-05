import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { CatsModule } from 'src/cats/cats.module';

@Module({
    controllers: [AdminController],
})
export class AdminModule {}
