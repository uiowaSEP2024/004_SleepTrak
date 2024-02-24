FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN yarn install

EXPOSE 3000

CMD yarn dev-docker
