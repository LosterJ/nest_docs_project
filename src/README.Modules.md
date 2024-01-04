#Modules

$ nest g mo <module-name> $

A module is a class annotated with a @Module() decorator (provides metadata that Nest makes use of to organize the app structure).

                            Users Module
    Feature Module 1                 \
                     \                \
    Feature Module 2 - Orders Module -- App Module
                                      /
        Feature Module 3 - Chat Module

Each app has at least 1 module, a root module.
    - Root module is the starting point Nest uses to build "app graph" - the internet data structure uses to resolve module and provider relationships and dependencies.
    - While very small app may theoretically have just the root module, this not the typical case.
Modules are stringly recommended as an effective way to organize your components (each module encapsulating a closely related set of capabilities).

The @Module() decorator takes a single object whose properties describe the module:
    - imports: the list of imported modules that export the providers which are required in this module
    - controllers: the set of controllers defined in this module which have to be instantiated
    - providers: the providers that will be instantiated by the Nest injector and that may be shared at least across this module
    - exports: the subset of providers that are provided by this module and should be availabel in other modules which import this module. You can use either the provider itself or just its token
The module encapsulates providers by default. This means that it's impossible to inject providers that are neither directly part of the current module nor exported from the imported modules. Thus, you may consider the exported providers from a module as the module's public interface (API).

Feature modules
    cats.module.ts -> app.module.ts

    The CatsController & CatsService belong to the same application domain. As they are closely related, it makes sense to move them into a feature module.
    A feature module simply organizes code relevant for a specific feature, keeping code organized and establishing clear boundaries (Help manage complexity and dev with SOLID principles, especially as the size of app and/or team grow).

Share modules
    cats.module.ts

    In Nest, modules are singletons by default, and thus you can share the same instance of any provider between multiple modules effortlessly.

                                  / Users Module
                    Shared Module - Orders Module
                                  \ Chat Module

    Every module is automatically a shared module. Once created it can be reused by any module. In order to do that, we first need to export the (CatsService) provider by adding it to the module's exports array.

Module re-exporting
    As seen above, Modules can exprot their internal providers. In addition, they can re-export modules that they import. In the example below, the CommonModule is both imported into and exported from CoreModule, making it available for other modules which import this one.

    @Module({
        imports: [CommonModule],
        exports: [CommonModule]
    })
    exports class CoreModule {}

Dependency injection
    cats.module.ts

    A module class can inject providers as well. However, module classes themselves cannot be injected as providers due to circular dependency (fundamentals/circular-dependency)

Global modules
    cats.module.ts

    If you have to import the same set of modules everywhere, it can get tedious. In Nest, encapsulates providers inside the module scope. You aren't able to use a module's providers elsewhere without first importing the encapsulating module.
    When you want to provide a set of providers which should be available everywhere out-of-the-box (e.g., helpers, db connection,...), make the module global with the @Global() decorator.