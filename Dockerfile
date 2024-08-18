# stage 1: build
FROM node:22 AS build

WORKDIR /apps/auths

COPY package*.json ./

RUN npm install

COPY . .

# stage 2: production
RUN npm run build

FROM node:22.6.0-alpine3.19

WORKDIR /apps/auths

COPY --from=build /apps/auths/dist ./

COPY ./.env ./.env

COPY package*.json ./

RUN npm install --production

EXPOSE 8010

# start
CMD ["npm", "run", "start"]