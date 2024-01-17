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
> When using