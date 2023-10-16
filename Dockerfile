FROM node:18.17
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
COPY . .
RUN yarn install
EXPOSE 6900
RUN yarn build
CMD [ "node", "server.js" ]