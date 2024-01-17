# Middleware

## General

Middleware is a function which called before the route handler.

Middleware functions have access to the *request* and *response* objects, and the *next() middleware function* in the app's req-res cycle.
    
        Client_Side     ---HTTP_Req--->      Middleware      ------>      Route_Handler


Nest middleware are equivalent to **express** middleware, it can perform the following tasks:
- execute any code
- make changes to the req and the res objects
- end the req-res cycle
- call the next middleware function in the stack
- if the current middleware doesn't end the req-res cycle, it must call *next()* to pass control to the next middleware function (Otherwise, the request will be left hanging)

You implement custom Nest middleware in either a function, or in a class with an @Injectable() decorator. The class should implement the **NestMiddleware** interface, while the function does not have any special requirement.
    
*Express and fastify handle middleware differently and provide different method signatures*

    logger.middleware.ts

## Dependency injection

Nest middleware fully supports Dependency Injection. Just as with providers and controllers, they are able to inject dependencies that are available within the same module. As usual, this is done through the constructor.

## Applying middleware

There is no place for middleware in the @Module() decorator. Instead, we set them up using the configure() method of the module class. Modules that include middleware have to implement the NestModule interface.
        LoggerMiddleware --> AppModule

- The configure() method can be made asynchronous using async/await
(e.g., you can await completion of an asynchronous operation inside the configure() method body).

- When using the express adapter, NestJS app will register json and urlencoded from the package body-parser by default.
This means if you want to customize that middleware via the MiddlewareCustomer, you need to turn off the global middleware by setting the bodyParser flag to false when creating the app with NestFactory.create()

- We may also further restrict a middleware to a particular req method (passing an object containing the route path and req method to forRoutes() method):
```TS
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(LoggerMiddleware)
        .forRoutes({path: 'cats', method: RequestMethod.GET})
    }
```

## Route wildcard

```TS
forRoute({ path: 'ab*cd, method: RequestMethod.ALL '});
```
The characters ?, +, *, () may be used in a route path, and are subsets of their regular expression counterparts.
The hyphen (-) and the dot (.) are interpreted literally by string-based paths.
*The fastify package uses the latest version of the path-to-regexp package, which no longer supports wildcard asterisks \*. Instead, you much use parameters(e.g., (.\*), :splat\*)*

## Middleware consumer

is a helper class, provides several built-in methods to manage middleware. All of them (build-in methods) can be simply chained in the fluent style. The forRoutes() method can take a single string, multiple strings, a RouteInfo object, a controller class and even multiple controller classes.

`forRoutes(FirstController,SecondControler);`

In most cases you'll probably just pass a list of controllers separated by commas.

```TS
forRoutes(
    { path: 'first/route1', method: RequestMethod.GET},
    { path: 'first/route2', method: RequestMethod.POST},
    { path: 'second/*', method: RequestMethod.ALL},
);
```
The apply() method may either take a single middleware, or multiple arguments to specify multiple middlewares.

## Excluding routers

At times we want to exclude certain routes from having the middleware applied. We can use exclude() method.
This method can take a single string, multiple strings, or a RouteInfo object identifying routes to be excluded.
```TS
    consumer
    .apply(LoggerMiddleware)
    .forRoutes(CatsController)
    .exclude(
        { path: 'cats', method: RequestMethod.GET },
        { path: 'cats', method: RequestMethod.POST },
        'cats/(.*)',
    );
```
The exclude() method supports wildcard parameters using the path-to-regexp package.

## Functional middleware

In the first version of LoggerMiddleware class, we've been using is quite simple (no members, no additional methods, and no dependencies). When we define it in a simple function instead of a class, this type of middleware is called functional middleware.

```TS
// (logger.middleware.ts) 
    export function logger(req: Request, res: Response, next: NextFunction) {
        console.log(`Request...`);
        next();
    };

// (app.module.ts)
    consumer
    .apply(logger)
    .forRoutes(CatsController);
```

Consider using the simpler functional middleware alternative any time your middleware doesn't need any dependencies.

## Multiple middleware

In order to bind multiple middleware that are executed sequentially, simply provide a comma separated list inside the apply() method
`consumer.apply(cors(),helmet(),logger).forRoutes(CatsController);`

## Global middleware
If we want to bind middleware to every registered route at once, we can use the use() method that is supplied by the INestApplication instance.

```TS
    // (main.ts)
    const app = await NestFactory.create(AppModule);
    app.use(logger);
    await app.listen(3000);
```

Access the DI container in a global middleware is not possible. You can use a functional middleware instead when using app.use(). Alternatively, you can use a class middleware and consume it with .forRoute('*') within the AppModule (or any other module).