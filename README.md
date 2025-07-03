<h1 align="center"><a href="https://api-credit-fit.alexgalhardo.com" target="_blank">api-credit-fit.alexgalhardo.com</a></h1>

## FrontEnd

- Live: <https://credit-fit.alexgalhardo.com>
- Source Code: <https://github.com/AlexGalhardo/credit-fit.alexgalhardo.com>

## Technologies

- [NodeJS v22](https://nodejs.org/en)
- [NestJS v11](https://nestjs.com/)
- [PrismaORM](https://www.prisma.io/)
- [Docker](https://docs.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)

## Prerequisites

- Node v22 and NPM v11

```bash
nvm install 22.9.0
nvm use 22.9.0
npm install -g npm@11.4.2
```

## Local Development Setup using Docker

1. Clone repository

```bash
git clone git@github.com:AlexGalhardo/farm-nestjs-api.git
```

2. Enter repository

```bash
cd farm-nestjs-api/
```

3. Install dependencies

```bash
npm install
```

4. Setup your environment variables

```bash
cp .env.example .env
```

5. UP Docker with Postgres & API

```bash
sudo chmod +x setup.sh && ./setup.sh
```

6. The Server API will start Inside docker connecting to your local machine at: <http://localhost:3000>

## Prisma Studio (DataBase GUI)

- To Start Prisma Studio:

```bash
npm run prisma:studio
```

## Build

a. Creating build

```bash
npm run build
```

b. Testing build server locally

```bash
npm run start
```

## API Requests and Docs

- You can see and use the HTTP Requests references inside folder [rest-client/](rest-client/)
- OpenAPI Documentation (using Swagger)
  - Localhost: <http://localhost:3000/api-docs>

## Tests

a. Run Unit Tests

```bash
npm run test
````

b. Run e2e Tests

```bash
npm run test:e2e
```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) July 2025-present, [Alex Galhardo](https://github.com/AlexGalhardo)
