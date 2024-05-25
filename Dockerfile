FROM node:latest

COPY . .

RUN npm i

CMD ["node", "index.mjs"]