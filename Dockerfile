FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

ARG VITE_API_URL=default_value
ENV VITE_API_URL=${VITE_API_URL}
ARG VITE_GOOGLE_MAPS_API_KEY=default_value
ENV VITE_GOOGLE_MAPS_API_KEY=${VITE_GOOGLE_MAPS_API_KEY}

RUN yarn build

# Step 2: Serve the React app using `serve`
FROM node:20

RUN yarn global add serve

WORKDIR /app

COPY --from=builder /app/dist ./dist

EXPOSE 8080 

CMD ["serve", "-s", "dist", "-l", "8080"]
