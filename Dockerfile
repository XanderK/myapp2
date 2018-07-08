FROM node:alpine AS carparts

RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app

ENV NODE_ENV=productive

EXPOSE 3000

CMD ["npm", "start"]
