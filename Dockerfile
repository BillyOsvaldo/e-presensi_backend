FROM node:latest

RUN mkdir -p /app
WORKDIR /app

COPY config /app
COPY installation /app
COPY public /app
COPY src /app
COPY test /app
COPY package.json /app

RUN npm -g install nodemon

# install npm dependency
RUN npm install

CMD ["yarn", "start"]