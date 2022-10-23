FROM node:18-alpine3.15 As development

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=development

COPY . .

FROM node:18-alpine3.15 As build

WORKDIR /app

COPY package*.json ./

COPY --from=development /app/node_modules ./node_modules

COPY . .

RUN npm run build

FROM node:18-alpine3.15 As production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD ["node", "dist/main"]