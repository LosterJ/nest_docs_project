# Guards

A guards is a class annotated with the @Injectable() decorator, which implements the *CanActivate* interface.

        Client Side     ---HTTP Request--->     Guard     --------->     Route Handeler (@RequestMapping)
    
Guards have a single responsibility: They determine whether a given request will be handled by the route handler or not, depending on certain conditions (permissions, roles, ACLs, etc.) persent at run-time. This often referred to as authorization.
    
Authorization (and its cousin, authentication, with which it usually collaborates) has typically been handled by middleware in tranditional Express app.
- Middleware is fine choice for authentication, since things like token validation and attaching properties to the request object are not strongly connected with a particular route context (and its metadata). But middleware, by its nature, is dumb. It doesn't know which handler will be executed after calling the next() function.
- On the other hand, Guards have access to the ExcutionContext instance, and thus know exactly what's going to be executed next. They're designed, much like exception filters, pipes and interceptors, to let you interpose processing logic at exactly the right point in the request/response cycle, and to do so declaratively.
> Help keep your code DRY and declarative.

Guards are executed after all middleware, but before any interceptor or pipe.

## Authorization guard

Authorization is a great use case for Guards because specific routes should be available only when the caller has sufficient permissions (usually a specific authenticated user).

        auth.guard.ts (The main point of this example is to show how guards fit into the request/response cycle)

> If you are looking for a real-world example on how to implement an authentication mechanism in your app, visit [security/authentication] (https://docs.nestjs.com/security/authentication). Likewise, for more sophisticated authorization example, check [security/authorization] (https://docs.nestjs.com/security/authorization)

Every guard must implement a canActivate() function. This function should return a boolean, indicating whether the current request is allowed or not. It can return the response either sync or async (via a Promise or Observable). Nest uses the return value to control the next action:
- if it return true, the request will be processed
- if it return false, Nest will deny the request

## Execution context

The canActivate() function takes a single argument, the ExecutionContext instance. The ExecutionContext inherits from ArgumentsHost.
In the sample above, we are using the helper methods (`switchToHttp()` and `getRequest()`) defined on ArgumentsHost to get a reference to the Request object.
By extending ArgumentsHost, ExecutionContext also adds several new helper methods that provide additional details about the current execution process. These details can be helpful in building more generic guards that can work across a broad set of controllers, methods, and [execution contexts](https://docs.nestjs.com/fundamentals/execution-context).

## Role-based authentication

        roles.guard.ts

Let's build a more functional guard that permits access only to users with a specific role. We'll start with a basic guard template, for now, allows all requests to proceed.

## Binding guards

Like pipes and exception filters, guards can be controller-scoped, method-scoped, or global-scoped.
In this example, we set up a controller-scoped guard using the @UseGuards() decorator. This decorator may take a single argument, or a comma-separated list of arguments.
```JS
@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {}
```
Above, we passed the RolesGuard class (instead of an instance), leaving responsibility for instantiation to the framework and enabling DI. We can also pass an in-place instance:
```JS
@Controller('cats')
@UseGuards(new RoleGuard())
export class CatsController {}
```
If we wish the guard to apply only to a single method, we apply the @UseGuards() decorator at the **method level**.
In order to set up a global guard, use the useGlobalGuards() method of the Nest app instance:
```JS
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard());
```

> In the case of hybrid apps the useGlobalGuards() method doesn't set up guards for gateways and microservices by default (read [faq/hybrid-app](https://docs.nestjs.com/faq/hybrid-application) to change this behavior)

In terms of DI, global guards registered from outside of any module cannot inject dependencies since this is done outside the context of any module. In order to solve this issue, you can set up a guard directly from any module using the following construction:
```JS
@Module({
        providers: [{
                provider: APP_GUARD,
                useClass: RolesGuard,
        }],
})
export class AppModule {}
```
> When using this approach to perform dependency injection for the guard, note that regardless of the module where this construction is employed, the guard is ,in fact, global. Where should this be done? Choose the module where the guard is defined. Also, useClass is not the only way of dealing with custom provider registration. Learn more [fundamentals/custom-providers](https://docs.nestjs.com/fundamentals/custom-providers)

## Setting roles per handler

Our RolesGuard is working, but it's not very smart yet. We're not yet taking advantage of the most important guard feature - the execution context. It doesn't yet know about roles, or which roles are allowed for each handler.

The CatsController, for example, could have different permission schemes for diffirent routes. Some might be available only for an admin user, and others could be open for everyone. How can we match roles to routes in a flexible and reusable way?
This is where custom metadata comes into play (learn more [fundamentals/execution-context#reflection-and-metadata](https://docs.nestjs.com/fundamentals/execution-context#reflection-and-metadata)). Nest provides the ability to attach custom metadata to route handlers through either decorators created via Reflector#createDecorator static method, or the built-in @SetMetadata() decorator.

For example, let's create a @Roles() decorator using the Refector#createDecorator method that will attach the metadata to the handler. Reflector is provided out of the box by the framework and exposed from the @nestjs/core package.

```JS
// roles.decorator.ts
import { Reflector } from '@nestjs/core'
export const Roles = Reflector.createDecorator<string[]>();
```
The Roles decorator here is a function that takes a single argument of type string[].
Now, to use this decorator, we simply anotate the handler with it:
```JS
// cats.controller.ts
@Post()
@Roles(['admin'])
async create(@Body() createCatDto: CreateCatDto) {
        this.catsService.create(createCatDto);
}
```
Here we've attached the Roles decorator metadata to the create() method, indicating that only users with the admin role should be allowed to access this route.

Alternatively, instead of using the Reflector#createDecorator method, we could use the built-in @SetMetadata() decorator. Learn more [fundamentals/execution-context#low-level-approach](https://docs.nestjs.com/fundamentals/execution-context#low-level-approach).

## Putting it all together

Now go back and tie this together with our RolesGuard. Currently, it simply returns true in all cases (allowing every request to process). We want to make the return value conditional based on the comparing the roles assigned to the current user to actual roles required by the current route being processed.

In order to access the route's role(s) (custom metadata), we'll use the Reflector helper class again, as follows:

        roles.guard.ts

> In the node.js world, it's common practice to attach the authorized user to the request object. In our sample code above, we are assuming that request.user contains the user instance and allowed roles. In your app, you will probably make that associatioin in your custom authentication guard (or middleware). Check [security/authentication](https://docs.nestjs.com/security/authentication) for more.

Refer to [Reflection and metadata](https://docs.nestjs.com/fundamentals/execution-context#reflection-and-metadata) for more details on utilizing Reflector in a context-sensitive way.

When a user with insufficient privileges requests an endpoint, Nest automatically returns the following response:
```JSON
{
        "statusCode": 403,
        "message": "Forbidden resource",
        "error": "Forbidden"
}
```
Note that behind the scenes, when a guard returns false, the framework throws a ForbiddenException. If you want to return a different error response, you should throw your own specific exception. For example:
```TS
throw new UnauthorizedException();
```
Any exception thrown by a guard will be handled by the exception layer (global exceptions filter and any exceptions filters that are applied to the current context).