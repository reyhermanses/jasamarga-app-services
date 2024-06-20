FROM node:18-alpine

RUN apk update && apk add bash \
    nano \
    tzdata \
    openrc \
    git \
    openssh \
    redis

WORKDIR /var/www/html

COPY package.json /var/www/html

RUN npm install --omit=dev

RUN npm install pm2 -g

ENV TZ="Asia/Jakarta"
ENV NODE_OPTIONS=--max_old_space_size=8192

COPY . /var/www/html

EXPOSE 8081
EXPOSE 8080

RUN cp /usr/share/zoneinfo/Asia/Jakarta /etc/localtime

RUN echo "Asia/Jakarta" > /etc/timezone

RUN mkdir /run/openrc
RUN mkdir /run/openrc/softlevel
RUN touch /run/openrc/softlevel

CMD ["/bin/bash", "-c", "redis-server --daemonize yes;openrc;pm2-runtime start \"npm start\" --name aggregator"]