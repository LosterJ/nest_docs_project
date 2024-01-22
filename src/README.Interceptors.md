# Interceptors

An interceptor is a class annotated with the @Injectable() decorator and implements the NestInterceptor interface.

                        ||Interceptor||

                    ----------------------->
        Client Side         Req/Res             @Get()
                    <-----------------------    RouteHandler

                        ||Interceptor||

Interceptors have a set of useful capabilities which are inspired by the Aspect Oriented Programming (AOP) technique. They make it possible to:
- bind extra logic before/after method execution
- transform the result returned from a function
- transform the exception thrown from a function
- extend the basic function behavior
- completely override a function depending on specific conditions (e.g., for caching purposes)

## Basics

Each interceptor implements the intercept() method, which take 2 arguments:
- the first one is the ExecutionContext instance (exactly the same object as for guards). The ExecutionContext inherits from ArgumentsHost. There, we saw that it's a wrapper around arguments that have been passed to the original handler, and contains different arguments arrays based on the type of the app.
- the second argument is a CallHandler. The CallHandler interface implements the handle() method, which you can use to invoke the route handler method at some point in your interceptor. If you do NOT call the handle() method in your implementation of the intercept() method, the route handler won't be executed at all.

This approach means that the intercept() method effectively wraps the request/response stream. As a result, you may implement custom logic **both before and after** the execution of the final route handler. It clear that you can write code in your intercept() method that executes before calling handle(), but how do you affect what happens afterward?
- Because the handle() method returns an Observable, we can use powerful of RxJS operators to further manipulate the response.
- Using Aspect Oriented Programming terminology, the invocation of the route handler (i.e., calling handler()) is call the pointcut, indicating that it's the point at which our additional logic is inserted.

For example, an incoming POST /cats request. This request destined for create() handler defined inside the CatController.
- If an interceptor which does not call the handle() method is called anywhere along the way, the create() method won't be executed.
- Once handle() is called (and its Observable has been returned), the create() handler will be triggered. And once the response stream is received via the Observable, additional operations can be performed on the stream, and a final result returned to the caller.

## Aspect interception

The first use case we'll look at is to use an interceptor to log user interaction (e.g., storing user calls, asynchronously dispatching events or calculating a timestamp).
```TS logging.interceptor.ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    interceptor(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log('Before...');
        
        const now = Date.now();
        return next
            .handler()
            .pipe(
                tap(() => console.log(`After... ${Date.now() - now}ms`)),
            );
    }
}
```
> The NestInterceptor<T,R> is a genetic interface in which T indicates the type of an Observable<T> (supporting the response stream), and R is the type of the value wrapped by Observable<R>.
> Interceptors, like controllers, providers, guards, and so on, can DI through their constructor.

Since handle() return an RxJS observable, we have a wide choice of operators we can use to manipulate the stream. In the example above, we used the tap() operator, which invokes our anomymous logging upon gracefull or exceptional termination of the observable stream, but doesn't otherwise interfere with the response cycle.

## Binding interceptors
