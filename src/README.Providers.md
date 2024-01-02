Providers are a fundamental concept in Nest: services, repositories, factories, helpers,... are be treated as a provider.
providers are plain JS classes that are declared as providers in a module.
Main idea that it can be injected as a dependency 
(objects can create variours relationships with each other, and the function of "wiring up" these objects can delegated to the Nest runtime system)

    value
        \
        component
        /       \
    component    \
                controller
                 /
                /
        component
        /
    factory

Scope
    Controllers should handle HTTP requests and delegate more complex tasks to providers.

    Providers normally have a lifetime ("scope") synchronized with the app lifecycle. 
    When the app is bootstrapped, every dependency must be resolved, and therefore every provider has to be instantiated.
    Similarly, when the app shuts down, each provider will be destroyed.

    However, there are ways to make your provider lifetime request-scoped as well (in fundamentals/injection-scopes).

Custom providers
    Nest has a build-in IoC (Inversion of control) container that resolves relationships between providers.
    This feature underlies the DI feature described above, but is in fact far more powerful than it be described so far.
    There are several ways to define a provider (use values, classes and either asynchronous or synchronous factories).
    (More in fundamentals/dependency-injection)

Optional providers
    http.service.ts

Property-based injection
    http.service.ts
    
    The technique we've used so far is called constructor-based injection (providers are injected via the constructor method).
    Some specific cases, property-based injection might be useful (e.g. your top-level class depends on either one or multiple providers, passing them all the way up by calling super() in subclass from constructor can be very tedious)
    In order to avoid this, you can use the @Inject() decorator at the property level.
    *If your class doesn't extend another class, you should always prefer using constructor-based injection.*

Provider registration
    app.module.ts

    We have defined a provider (CatsService) + have a consumer of that service (CatsController) -> regist the service with Nest so that it can perform the injection (app.module.ts).

Manual instantiation
    In certain circumstances, you may need to step outside of the built-in Dependency Injection system and manually retrieve or instantiate providers.
        - The get existing instances, or instantiate providers dynamically, you can use fundamentals/module-ref.
        - To get providers within the bootstrap() function (e.g. standalone applications without controllers, utilize a configuration service during bootstrapping), see Standalone Apps.