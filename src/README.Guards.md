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