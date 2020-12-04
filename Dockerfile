FROM node:14.15.1-alpine

WORKDIR /home/node/app

COPY package.json /home/node/app
COPY yarn.lock /home/node/app

RUN yarn install --frozen-lock-file

COPY . .
ENV PORT 3002
CMD yarn build; yarn start