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