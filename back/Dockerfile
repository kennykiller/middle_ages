FROM node:14

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm install -g concurrently

COPY . .

EXPOSE 3000

CMD ["concurrently", "npm run dev", "npm run seed"]