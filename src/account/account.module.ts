import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { CatsModule } from 'src/cats/cats.module';

@Module({
    imports: [CatsModule],
    controllers: [AccountController],
})
export class AccountModule {}
