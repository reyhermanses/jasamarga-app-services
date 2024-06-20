# Use the Node.js image as a base
FROM node:16-alpine

# Install required dependencies
RUN apk update && apk add bash \
    nano \
    tzdata \
    openrc \
    git \
    openssh \
    redis

# Set the working directory
WORKDIR /var/www/html

# Copy the package.json and install dependencies
COPY package.json /var/www/html
RUN npm install --only=prod

# Install PM2 globally
RUN npm install pm2 -g

WORKDIR /var/www/html

# Set the timezone
ENV TZ="Asia/Jakarta"
RUN cp /usr/share/zoneinfo/Asia/Jakarta /etc/localtime
RUN echo "Asia/Jakarta" > /etc/timezone

COPY . /var/www/html

RUN npx tsc

# Expose ports
EXPOSE 8080

# Start your application using PM2
CMD ["/bin/bash", "-c", "redis-server --daemonize yes;pm2-runtime ./dist/app.js"]