FROM node:20.9-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081


CMD ["npm", "start"]
