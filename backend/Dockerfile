FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .

EXPOSE 3000

RUN yarn prisma generate

CMD yarn start
