FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL


RUN yarn build

FROM node:20

RUN yarn global add serve

WORKDIR /app

COPY --from=builder /app/dist ./dist

EXPOSE 8080 

CMD ["serve", "-s", "dist", "-l", "8080"]
