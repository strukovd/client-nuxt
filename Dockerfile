FROM node:16

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 8088

CMD ["npm", "start"]
