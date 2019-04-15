FROM node:10 as base
WORKDIR /usr/src/app
COPY package*.json ./

FROM base as compilation
RUN npm ci
COPY . .
RUN npm run compile
RUN npm t

FROM compilation as release
COPY --from=compilation /usr/src/app/dist/src ./src
RUN npm ci --only=production
EXPOSE 3000
CMD [ "npm", "start" ]

