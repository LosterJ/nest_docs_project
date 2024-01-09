import { DynamicModule, Module } from '@nestjs/common';
import { ConfigOptions } from 'src/config-options/config-options.interface';
import { ConfigService } from 'src/config/config.service';

@Module({})
export class ExampleModule {
    static register(options: ConfigOptions): DynamicModule {
        return {
            module: ExampleModule,
            providers:[
                {
                    provide: ConfigService,
                    useValue: new ConfigService(options),
                }
            ],
            exports: [ConfigService],
        };
    }
}
