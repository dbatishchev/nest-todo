https://github.com/dmitrytut/todo-nestjs-coding-task

[] change bcrypt to bcrypt.js
[] https://www.tomray.dev/nestjs-docker-compose-postgres
[] https://github.com/crudjs/rest-nestjs-postgres/blob/master/docker-compose.yml
[] create docker-compose file
[] create test for incorrect data structure
[] create test for incorrect auth token
[] example of mocking in unit tests: https://doug-martin.github.io/nestjs-query/docs/persistence/typeorm/testing-services/
[] add migration https://medium.com/@gausmann.simon/nestjs-typeorm-and-postgresql-full-example-development-and-project-setup-working-with-database-c1a2b1b11b8f
[] add explicit conversion of some params https://docs.nestjs.com/techniques/validation
[] add partial type https://docs.nestjs.com/techniques/validation

$ # GET /profile
$ curl http://localhost:3000/profile
$ # result -> {"statusCode":401,"message":"Unauthorized"}

$ # POST /auth/login
$ curl -X POST http://localhost:3000/auth/login -d '{"username": "john", "password": "changeme"}' -H "Content-Type: application/json"
$ # result -> {"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vybm... }

$ # GET /profile using access_token returned from previous step as bearer code
$ curl http://localhost:3000/profile -H "Authorization: Bearer "
$ # result -> {"userId":1,"username":"john"}
