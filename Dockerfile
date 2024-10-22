FROM node:lts-buster-slim

RUN mkdir -p /bot/database
WORKDIR /bot
COPY . /bot

RUN npm ci --omit=dev && \
    npm cache clean --force && \
    rm -rf /root/.npm /tmp/* && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && \ 
    apt-get update && apt-get install -y --no-install-recommends ffmpeg &&  \ 
    apt-get purge -y --auto-remove && \ 
    rm -rf /var/cache/apt/* /tmp/*

CMD ["node", "index.js"]