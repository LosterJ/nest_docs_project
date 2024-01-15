**Pipes**

A pipe is a class annotated with @Injectable() decorator, which implements the PipeTransform interface.

                                        |       Pipe
                                        |   Pipe    Pipe
            Client_Side       -------------------->      @Get() Route Handler
                              Filter    |
                            Filter      |

    Pipes have 2 typical use cases:
        - Transformation: transform input data to the desired form (e.g., from string to integer)
        - Validation: evaluate input data and if valid, simply pass it through unchanged; otherwise, throw an exception.
    In both cases, pipes operate on the arguments being processed by a controller route handler.
        Nest interposes a pipe just before a method is invoked, and the pipe receives the arguments destined for the method and operates on them.
        Any transformation or validation operation takes place at that time, after which the route handler is invoked with any (potentially) transformed arguments.
    Nest comes with a number of built-in pipes that you can use out-of-the-box. You can also build your own custom pipes.

    Pipes run inside the exceptions zone. This means that when a Pipe throws an exception it is handled by the exceptions layer.
    Given the above, it should be clear that when an exceptioin is thrown in a Pipe, no controller method is subsequently executed.
    -> This gives you a best-practice technique for validatioing data coming into the app from external sources at the systems boundary.

**Built-in pipes**
    Nest comes with nine pipes availabel out-of-the-box:
        - ValidationPipe
        - ParseIntPipe
        - ParseFloatPipe
        - ParseBoolPipe
        - ParseArrayPipe
        - ParseUUIDPipe
        - ParseEnumPipe
        - DefaultValuePipe
        - ParseFilePipe
        They're exported from the @nestjs/common package.
    Let's take a quick look at using ParseIntPipe. This is an example of the transformation use case, where the pipe exsures that a mehtod handler parameter is converted to a JS integer (or throws an exception if the conversion fails). Later in this chapter, we'll show a simple custom implementation for a ParseIntPipe. The example techiques below also apply to the other built-in transformation pipes (ParseBoolPipe, ParseFloatPipe, ParseEnumPipe, ParseArrayPipe and ParseUUIDPipe, which we'll refer to as the Parse* pipes in this chapter).

**Binding pipes**
    To use a pipe, we need to bind an instance of the pipe class to the appropriate context. In our ParseIntPipe example, we want to associate the pipe with a particular route handler method, and make sure it runs before the method is called. We do so with the following construct, which we'll refer to as binding the pipe at the method parameter level:
        (admin.controller.ts)
        @Get(':id')
        async findOne(@Param('id', ParseIntPipe) id: number) {
            return this.catsService.findOne(id);
        }
    This ensures that one of the following 2 conditions is true: either the parameter we receive in the findOne() method is a number (as expected in our call to this.catsService.findOne()), or an excpetion is thrown before the route handler is called.
        GET admin.localhost:3000/cats (error)
    The exception wil prevent the body of the findOne() method from executing.

    In the example above, we pass a class (ParseIntPipe), not an instance, leaving responsibility for instantiation to the framework and enabling dependency injection. As with pipe and guards, we can instead pass an in-place instance. Passing an in-place instance is useful if we want to customize the built-in pipe's behavior by passing options:
        @Get(':id')
        async findOne(
            @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatusCode.NOT_ACCEPTABLE}))
            id: number
        ) {
            return this.catsService.findOne(id);
        }
    Binding the other transformation pipes (all of the Parse* pipes) works similarly. These pipes all work in the context of validating route parameters, query string parameters and request body values.

        See more: techniques/validation

**Custom pipes**
    You can build your own custom pipes (Nest provides a robust built-in Parse* pipe and validation pipe)
    We start with a simple ValidationPipe. Initially, we'll have it simply take an imput value and immediately return the same value, behaving like an identity function.

        validation.pipe.ts

    Every pipe must implement the transform() method to fulfill the PipeTransform interface contract. This method has 2 parameters:
        - value
        - metadata
    The value parameter is the currently processed method argument (before it is received by the route handling method), and metadata is the currently processed argument's metadata. The metadata object has these properties:
        export interface ArgumentMetadata {
            type: 'body' | 'query' | 'param' | 'custom'; //Indicates whether the argument is a body,query,param,or a custom parameter(custom decorator)
            metatype?: Type<unknown>; //Provides the metatype of the argument (for example, String), the value is undefined if you not declaration
            data?:string; //The string passed to the decorator, or undefined if you leave the decorator parenthesis empty
        }
    
    //WARNING: TypeScript interfaces disappear during transpilation. Thus, if a mehtod parameter's type is declared as an interface instead of a class, the metadata value will be Object.

**Schema based validation**
    Let's make our validation pipe a little more useful. 
    Take a closer look at create() method of the CatsController, where we probably would like to ensure that the post body object is valid before attempting to run our service method.
        - We want to ensure that any incoming request to the create method contains a valid body -> have to validate the three members of the createCatDto object.
            |-> We could do this *inside the route handler method* > doing so is not ideal as it would *break the single responsibility principle* (SRP)
            |-> Create a *validator class* and delegate the task there /> Disadvantage that we would have to *remember to call this validator at* the beginning of each method
            |-> Creating validation *middleware*? /> It could work, but *not possible to create generic middleware* wich can be used across all contexts across the whole app (Because middleware is unaware of the execution context, including the handler that will be called and any of its parameters)
            => This is exactly the use case for which **pipes are designed**.

**Object schema validation**
    There are several approaches available for doing object validation in a clean and DRY (don't repeat youself) way.
        One common approach is to use schema-based validation. Let's go ahead and try that approach.
    
    The Zod library allows you to create schemas in a straightforward way, with a readable API. 
        Let's build a validation pipe that make use of Zod-based schemas.
            $ npm install --save zod

    We create a simple class that takes a schema as a constructor argument, then apply the schema.parse() method, which validates our incoming argument against the provided schema.

        zod-validation.pipe.ts

    As noted earlier, a validationpipe either returns the value unchanged or throws an exception.

**Binding validation pipes**
    Earlier, we saw how to bind transformation pipes (like ParseIntPipe and the rest of the Parse* pipes).
    Binding validation pipes is also very straightforward.

    In this case, we want to bind the pipe at the method call level. In our current example, we need to do the following to use the ZodValidationPipe:
        1. Create an instance of the ZodValidationPipe
        2. Pass the context-specific Zod schema in the class constructor of the pipe
        3. Bind the pipe to the method
    
    Zod schema example:
        (create-cat.dto.ts)
        import { z } from 'zod';
        export const createCatSchema = z.object({
            name: z.string(),
            age: z.number(),
            breed: z.string(),
        }).required();
        export type CreateCatDto = z.infer<typeof createCatSchema>;
    
    We do that using the @UsePipes() decorator as shown below:
        (cat.controller.ts)
        @Post()
        @UsePipes(new ZodValidationPipe(createCatSchema))
        async create(@Body() createCatDto: CreateCatDto) {
            this.catsService.create(createCatDto);
        }
    @UsePipes() decorator is imported form the @nestjs/common package.

    zod lib requires the strictNullCheck configuration to be enabled in your tsconfig.json file.

    Example: create-cat.dto.ts, zod-validatioin.pipe.ts, cats.controller.ts

**Class validator**
    //WARNING: The techniques in this section require TS and are not available if your app is written using vanilla JS.

    Nest works well with the class-validator library. This powerful library allows you to decorator-based validation.
    Decorator-based validation is extremely powerful, espicially when combined with Nest's Pipe capabilities since we have access to the metatype of the processed property.
    First, we need to install the required packages:
        $npm i -s class-validator class-transformer
    
    Once these are installed, we can add a few decorators to the CreateCatDto class.
    -> Significant advantage of technique: the CreateCatDto class remains the single source of truth for our Post body object (rather than having to create a separate validation class).

        create-cat.dto.ts
        validation.pipe.ts

    You don't have to build a generic validation pipe on your own since the ValidationiPipe is provided by Nest out-of-the-box.
    The built-in ValidationPipe offers more options than the sample we built in this chapter, which has been kept basic for the sake of illustrating the mechanics of a custom-built pipe. You can find full details, along with lots of example. In techniques/validation.

    //NOTICE: The class-transformer and class-validator libraries is made by the same author, and as a result, they play very well together.

    Class-validator needs to use the validation decorators we defined for our DTO earlier,
    so we need to perform this transformation to treat the incoming body as an appropriately decorated object, not just a plain vanilla object.
    
    The last step is to bind the ValidationPipe. Pipes can be parameter-scoped, or global-scoped.
        Earlier, with Zod-based validation pipe, we saw an example of binding the pipe at the method level.
        In the example below, we'll bind the pipe instance to the route handler @Body() decorator so that our pipe is called to validate the post body.

            cats.controller.ts

    Parameter-scoped pipes are useful when the validation logic concerns only one specified parameter.

**Global scoped pipes**
    Since the ValidationPipe was created to be as generic as possible, we can realize it's full utility by setting it up as a global-scoped pipe so that it is applied to every route handler across the entire application.

        (main.ts)
        async function bootstrap() {
            const app = await NestFactory.create(AppModule);
            app.useGlobalPipes(new ValidationPipe());
            await app.listen(3000);
        }
        bootstrap();

    In the case of hybrid apps the useGlobalPipes() method doesn't set up pipes for gateways and micro service.
    For standard (non-hybrid) microservice apps, useGlobalPipes() does mount pipes globally.

    Global pipes are used across the whole app, for every controller and every route handler.

    Note that in terms of dependency injection, global pipes registered from outside of any module (e.g., useGlobalPipes()) cannot inject dependencies since the binding has been done outside the context of any module. In order to solve this issue, you can set up a global pipe directly from any module using the following construction:
        (app.module.ts)
        @Module({
            providers: [
                {
                    provide: APP_PIPE,
                    useClass: ValidationPipe,
                },
            ],
        })
        export class AppModule {}
    
**The built-in ValidationPipe**
    You don't have to build a generic validation pipe since the ValidationPipe is provided by Nest out-of-the-box.
    It have more options and can use directly.

**Transformation use case**
    At the beginning of this chapter, we mentioned that a pipe can also transform the input data to the desired format.
        This is possible because the value returned from the transform function completely overrides the previous value of the argument.
    It's useful bcz sometimes the data passed form the client needs to undergo some change (string->integer) before it can be properly handled by the route handler method. Or some requied data fields may be missing, so we would like to apply default values.
    -> Transformation pipes can perform these functions by interposing a processing function between the client request and the the request handler.

        parse-int.pipe.ts (this is simple pipe to parsing a string into an integer value - simple than built-in ParseIntPipe)
        admin.controller.ts

**Providing default**
    Parse* pipes expect a parameter's value to be defined. They throw an exception upon receiving null or undefined values.
    So, to allow an endpoint to handle missing querystring parameter values, we have to provide a default value to be injected before the Parse* pipes operate on these values
    -> The DefaultValuePipe serves that purpose. Simply instantiate a DefaultValuePipe in the @Query() decorator before the relevant Parse* pipe:
            @Get()
            async findAll(
                @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly: boolean,
                @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
            ) {
                return this.catsService.findAll({ activeOnly, page });
            }