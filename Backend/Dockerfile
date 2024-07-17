FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

#This will make the size of the container so big because of dev dependencies and all
#Thats why I am going to use multistage system of Docker

# build production image

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

#Env is in production,
ENV NODE_ENV=production

RUN npm ci

COPY --from=builder /app/dist ./dist

#Changing the ownership from root to Node
RUN chown -R node:node /app && chmod -R 755 /app

RUN npm install pm2 -g

COPY ecosystem.config.js .

USER node

EXPOSE 5513

CMD ["pm2-runtime", "dev ", "ecosystem.config.js"]