import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
    private readonly cats: Cat[] = [];

    create(cat: Cat) {
        this.cats.push(cat);
    }

    findAll(): Cat[] {
        return this.cats;
    }

    get(): any {
        return 1;
    }
}

//The @Injectable() decorator attaches metatdata,
//which declares that CatsService is a class that can be managed by the Nest IoC container.