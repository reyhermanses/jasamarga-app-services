FROM node:18-alpine

RUN apk update && apk add bash \
    nano \
    tzdata \
    openrc \
    git

WORKDIR /var/www/html

COPY package.json /var/www/html

RUN npm install

ENV TZ="Asia/Jakarta"

COPY . /var/www/html

# RUN npm run build

EXPOSE 3000

RUN cp /usr/share/zoneinfo/Asia/Jakarta /etc/localtime

RUN echo "Asia/Jakarta" > /etc/timezone

# Set NODE_OPTIONS to increase memory allocation
# ENV NODE_OPTIONS=--max-old-space-size=2560

CMD ["/bin/bash", "-c", "npm run build && npm run start"]