FROM node:21-bookworm-slim
RUN apt-get update && apt-get install -y ffmpeg

RUN mkdir /bot
RUN mkdir -p /bot/database

WORKDIR /bot
COPY ./commands commands/
COPY ./events events/
COPY ./helpers helpers/
COPY index.js package.json deploy-commands-global.js ./

RUN npm install --omit=dev

ENV TOKEN=$TOKEN
ENV CLIENT_ID=$CLIENT_ID
ENV GUILD_ID=$GUILD_ID
ENV ACTIVITY=$ACTIVITY
ENV STATUS=$STATUS
ENV OWNERID=$OWNERID

RUN rm -rf /var/cache/apt/* /tmp/* 

CMD ["node", "index.js"]
