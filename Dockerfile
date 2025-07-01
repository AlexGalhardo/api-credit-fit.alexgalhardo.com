FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN cp .env.example .env

RUN npx prisma generate

CMD ["sh", "-c", "npx prisma migrate dev --name init && npm run dev"]