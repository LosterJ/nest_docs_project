import { Injectable } from '@nestjs/common';
import { ConfigOptions } from 'src/config-options/config-options.interface';

@Injectable()
export class ConfigService {
    private readonly apiKey: string;
    private readonly apiUrl: string;

    constructor(options: ConfigOptions) {
        this.apiKey = options.apiKey;
        this.apiUrl = options.apiUrl;
    }

    getApiKey(): string {
        return this.apiKey;
    }

    getApiUrl(): string {
        return this.apiUrl;
    }
}
