FROM node:14.15.1-alpine as BUILD_IMAGE

WORKDIR /app

COPY package.json yarn.lock .yarnclean ./

RUN yarn install --frozen-lock-file

COPY . .

RUN yarn build
RUN rm -rf ./node_modules
RUN yarn install --frozen-lock-file --production

FROM node:14.15.1-alpine

WORKDIR /app

COPY --from=BUILD_IMAGE /app/dist ./dist
COPY --from=BUILD_IMAGE /app/package.json ./package.json
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules

CMD yarn start