# Base image
FROM node AS base

# Install pnpm globally
RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml./
RUN pnpm install

# from dependencies get 
FROM dependencies AS build

WORKDIR /app
COPY..
RUN pnpm build
RUN pnpm prune --prod

FROM node:alpine AS deploy

WORKDIR /app
COPY --from=build /app/dist./dist
COPY --from=dependencies /app/node_modules./node_modules

CMD [ "node", "dist/main.js" ]