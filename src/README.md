$ npm i -g @nestjs/cli

$ nest new project-name

<!-- 
app.controller.spec.ts: The unit tests for the controller
app.controler.ts: A basic controller with a single route
app.module.ts: The root module of the app
app.service.ts: A basic service with a single method
main.ts: 
    - The entry file of the app which uses the core function in NestFactory to create a Nest app instance
    - Includes an async func, which will bootstrap our app 
-->

$ npm run start:dev | npm run lint | npm run format

<!--
    For quickly creating a CRUD controller with validation build-in:
    $ nest g resource [name]
-->

$ nest g controller [name]

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
