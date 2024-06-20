# Use the Node.js image as a base
FROM node:18-alpine

# Install required dependencies
RUN apk update && apk add bash \
    nano \
    tzdata \
    openrc \
    git \
    openssh \
    dcron

# Set the working directory
WORKDIR /var/www/html

# Copy the package.json and install dependencies
COPY package.json /var/www/html
RUN npm install --only=prod

# Install PM2 globally
RUN npm install pm2 -g

# Set the timezone
ENV TZ="Asia/Jakarta"
RUN cp /usr/share/zoneinfo/Asia/Jakarta /etc/localtime
RUN echo "Asia/Jakarta" > /etc/timezone

# Copy your application code
COPY . /var/www/html

# Create necessary directories
RUN mkdir -p /var/www/html/public/jsondata/{basic-pay,education,employee-om-action,family,profile/JM_ADDRESS,profile/JM_BPJS_KES,profile/JM_BPJS_TK,profile/JM_PERSONAL_DATA,profile/JM_PERSONAL_ID,profile/JM_TAX_ID}

EXPOSE 8081
EXPOSE 8080

# Start your application using PM2 with 4 instances and cron
CMD ["/bin/sh", "-c", "pm2-runtime start --instances 1 ./bin/www"]
