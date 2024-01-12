**Exception filters**

Nest comes with a built-in exceptions layer which is responsible for processing all unhandled exceptions across an app.
When an exception is not handled by your app code, it is caught by this layer, which then automatically sends an appropriate user-friendly response.

                                        |       Pipe
                                        |   Pipe    Pipe
            Client_Side       -------------------->      @Get() Route Handler
                              Filter    |
                            Filter      |

    Out of the box, this action is performed by a built-in global exception filter,
        which handles exceptions of type HttpException (and subclasses of it).
    When an exception is unrecognized (is neither HttpException nor a class that inherits form HttpException),
        the built-in exception filter generates the following default JSON response:
            {
                "statusCode": 500,
                "message": "Internal server error"
            }
    The global exception filter partially supports the http-errors library.
        Basically, any thrown exception containing the statusCode and message properties will be properly populated and sent back as a response
        (instead of the default InternalServerErrorException for unrecognized exceptions).

**Throwing standard exceptions**
    Nest provides a built-in HttpException class, exposed from the @nestjs/common package.
    For typical HTTP REST/GraphQL API based applications, it's best paractice to send standard HTTP response objects when certain error conditions occur.
            cats.controller.ts
                @Get()
                async throwException() {
                    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
                }
            When client call that endpoint, the res look like:
                {
                    "statusCode": 403,
                    "message": "Forbidden"
                }
    The HttpException constructor takes 2 required arguments which determine the response:
        - The *response* argument defines the JSON response body. It can be *string* or an *object* as described below.
        - The *status* argument defines the HTTP status code. (should be valid HTTP status code)
        - (Optional argument) The *options* argument can be used to provide an *error cause*
    By default, the JSON response body contains 2 properties:
        - statusCode: default to the HTTP status code provided in the status argument
        - message: a short description of the HTTP error based on the status
    To override:
        - the message portion of the JSON response body -> supply *a string* in the response argument
        - the entire JSON response body -> pass an object in the response argument
            Nest will serialize the object and return it as the JSON response body.
        The cause object, in the third constructor argument, is not serialized into the response object, but it can be useful for logging purposes,
        providing valuable information about the inner error that caused the HttpException to be thrown.

**Custom exceptions**
    In many cases, you will not need to write custom exceptions.
    If you do need to customized exceptions, it's good practice to create your own exceptions hierarchy (inherit from the base HttpException class).
    -> With this approach, Nest will recognize your exceptions, and automatically take care of the error responses.

        forbidden.exception.ts
        cats.controller.ts

**Built-in HTTP exceptions**
    Nest privides a set of standard exceptions that inherit from the base HttpException (exposed from @nestjs/common package)
        - BadResquestException
        - UnauthorizedException
        - NotFoundException
        - ForbiddenException
        - NotAcceptableException
        - RequestTimeoutException
        - ConflictException
        - GoneException
        - HttpVersionNotSupportedException
        - PayloadTooLargeException
        - UnsupportedMediaTypeException
        - UnprocessableEntityException
        - InternalServerErrorException
        - NotImplementedException
        - ImATeapotException
        - MethodNotAllowedException
        - BadGatewayException
        - ServiceUnavailableException
        - GatewayTimeoutException
        - PreconditionFailedException
    All the built-in exceptions can also provide both an error cause and an error description using the options parameter:
            throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'Some error description'})
        Using the above, this is how the response would look:
            {
                "message": "Something bad happened",
                "error": "Some error description",
                "statusCode": 400,
            }

**Exception filters**
    While the base (built-in) exception filter can automatically handle many cases for you, you may want full control over the exceptions layer.
        (for example, you may want to add logging or use a different JSON schema based on some dynamic factors)
    Exception filters are designed for exactly this purpose.
        They let you control the exact flow of control and the content of the response sent back to the client.
    
            http-exception.filter.ts

    All exception filters should implement the generic ExceptionFilter<T> interface. 
        This requires you to provide the catch(exception: T, host: ArgumentsHost) method with its indicated signature. 
        <T> indicates the type of the exception.
    *If you are using @nestjs/platform-fastify, you can use response.send() instead of response.json()
        Don't forget to import the correct types from fastify.
    
    The @Catch(HttpException) decorator binds the required metadate to the exception filter, telling Nest that this particular filter is looking for exceptions of type HttpException and nothing else. The @Catch() decorator may take a single parameter, or a comma-separated list. So you can set up the filter for several types of exceptions at once.

**Arguments host**
    http-exception.filter.ts

    ArgumentsHost is a powerful utility object that will be talk in "fundamentals/execution context".
    The reason for this level of abstraction is that ArgumentsHost functions in all contexts (HTTP server, Microservices, WebSockets contexts).
    In th execution context chapter we'll see how we can access the appropriate underlying arguments for any execution context with the power of ArgumentsHost and its helper functions. This will allow us to write generic exception filters that operate across all contexts.

**Binding filters**
    Tie our new HttpExceptionFilter to the CatsController's create() method
        @Post()
        @UseFilters(new HttpExceptionFilter())
        async create(@Body() createCatDto: CreateCatDto) {
            throw new ForbiddenException();
        }
    
    The @UseFilters() decorator is imported from the @nestjs/common package,
    it can take a single filter instance, or a comma-separated list of filter instances.
    Alternatively, you may pass the class (instead of an instance), leaving responsibility for instantiation to the framework, and enabling DI:
        @Post()
        @UseFilters(HttpExceptionFilter)
        ...
    
    We prefer applying filters by using classes instead of instances when possible. 
    <- It reduces memory usage since Nest can easily reuse instances of the same class across you entire module.
    
    Exception filters can be scoped at different levels: method-scoped (of controller/resolver/gateway), controller-scoped, global-scoped.
        - Controller-scoped (set up this filter for every route handler defined inside the CatsController):
            @UseFilters(new HttpExceptionFilter())
            export class CatsController {}
        - Global-scoped (used across the whole app, for every controller and every route handler):
            (main.ts)
                async function bootstrap() {
                    const app = await NestFactory.create(AppModule);
                    app.useGlobalFilters(new HttpExceptionFilter());
                    await app.listen(3000);
                }
                bootstrap();
        (The useGlobalFilters() method does not set up filters for gateways or hybrid app)
    In terms of dependency injection, global filters registered from outside of any module cannot inject dependencies since this is done outside the context of any module. In order to solve this issue, you can register a global-scoped filter directly from any module using:
            (app.module.ts)
            @Module({
                provider: [{
                    provide: APP_FILTER,
                    useClass: HttpExceptionFilter,
                },...],
            })
            export class AppModule {}
    You can add as many filters with this tecnique as needed; simply add each to the providers array.
    // When using this approach to perform dependency injection for the filter, note that regardless of the module where this construction is employed,
    this filter is global.
    // Where should this be done? Choose the module where the filter is define.
    // useClass is not the only way of dealing with custom provider registration. (read more in fundamentals/custom-providers)

**Catch everything**
    In order to catch every unhandled exception (regardless of exception type), leave the @Catch() decorator's parameter list empty.

        all-exceptions.filter.ts
    
    When combining an exception filter that catches everything with a filter that is bound to a specific type, 
    the "Catch anything" filter should be declared first to allow the specific filter to correctly handle the bound type.

**Inheritance**
    Typically, you'll create fully customized exception filters crafted to fulfill your app requirements. However, there might be use-cases when you 
    would like to simply extend the built-in default global exception filter, and override the behavior based on certain factors.
    In order to delegate exception processing to the base filter, you need to extend BaseExceptionFilter and call the inherited catch() method.

        (all-exceptions.filter.ts)
        @Catch()
        export class AllExceptionsFilter extends BaseExceptionFilter {
            catch(exception: unknown, host: ArgumentHost) {
                super.catch(exception, host);
            }
        }
    
    Method-scoped and Controller-scoped filter that extend the BaseExceptionFilter should not be instantiated with "new". Instead, let the framework instantiate them automatically.

    Your implementation of the extended exception filter would include your tailored business (e.g., handling various conditions).
    
    Global filters can extend the base filter. This can be done in either of 2 ways:
    - To inject the HttpAdapter reference when instantiating the custom global filter
        (main.ts)
        async function bootstrap() {
            const app = await NestFactory.create(AppModule);

            const { httpAdapter } = app.get(HttpAdapterHost);
            app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

            await app.listen(3000);
        }
        bootstrap();
    - To use the APP_FILTER token in the above example.