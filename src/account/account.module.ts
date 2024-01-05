import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { CatsModule } from 'src/cats/cats.module';
import { CatsService } from 'src/cats/cats.service';

@Module({
    imports: [CatsModule],
    controllers: [AccountController],
    providers: [CatsService],
})
export class AccountModule {}
