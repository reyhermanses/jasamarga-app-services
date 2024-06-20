# Stage 1: Build the Vite project
FROM node:14 as build

WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app

EXPOSE 5173

CMD ["/bin/bash", "-c", "npm run dev"]