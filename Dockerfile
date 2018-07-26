FROM node:9.7
# set time +7
RUN mv /etc/localtime /etc/localtime.bak
RUN ln -s /usr/share/zoneinfo/Asia/Jakarta /etc/localtime

RUN npm install -g yarn
RUN npm install -g nodemon

# Create app directory
WORKDIR /usr/src/app

ENV APP_DIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

ENV NODE_ENV 'production'
ENV PORT '3030'

RUN yarn install --production

COPY . ./

RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]

CMD [ "yarn", "start" ]