import { Inject, Injectable, Optional } from '@nestjs/common';

@Injectable()
export class HttpService<T> {
    constructor(@Optional() @Inject('HTTP_OPTIONS') private httpClient: T) {}
}

/*
Property-based injection
    export class HttpService<T> {
        @Inject('HTTP_OPTIONS')
        private readonly httpClient: T;
}

// If your class doesn't extend another class, you should always perfer using constructor-based injection.
*/

/*
    Occasionally, you might have dependencies which do not necessarily have to be resolved.
    For instance, your class may depend on a configuration object, but if none is passed, the default values should be used.
    In such a case, the dependency becomes optional, because lack of the configuration provider wouldn't lead to errors.

    Note that in the example above we are using a custom provider, which is the reason we include the HTTP_OPTIONS custom token.
    (More in fundamentals/custom-providers)
*/