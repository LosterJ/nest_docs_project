Controller:
    - Routing:
    - Request object:
    - Resources:
    - Route wildcards:
    - Status code:
    - Headers:
    - Redirection:
    - Route parameters:
        cats.controller.ts
    - Sub-domain Routing:
        admin.controller.ts
        account.controller.ts
        app.module.ts
    - Scope: chua hoc
    - Asyschronicity:
    - Request payloads:
        cats.controller.ts

Before use any request payloads methods, we need to determine the DTO (Data Transfer Object) schema.
    A DTO is an object that defines how the data will be sent over the network.
    Should use classes but not TypeScript interfaces (bcz:
        - JS ES6 standard -> they are preserved as real entities in the compiled JS;
        - TS interfaces are removed during the transpilation, Nest can't refer to them at runtime.)
    This is important bcz features such as Pipes enable additional possibilities when they have access to the metatype of the variable at runtime.

