FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN yarn install
RUN apk add --no-cache bash

EXPOSE 3000
EXPOSE 5555

CMD bash -c './wait-for-it.sh db:5432 -- yarn prisma-setup' && yarn dev-docker
