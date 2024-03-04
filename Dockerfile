FROM node:21-bookworm-slim
RUN apt-get update && apt-get install -y ffmpeg

RUN mkdir /bot
RUN mkdir -p /bot/database

WORKDIR /bot
COPY ./src src/
COPY ./scripts scripts/
COPY index.js package.json ./

RUN npm install --omit=dev

ENV TOKEN=$TOKEN
ENV CLIENT_ID=$CLIENT_ID
ENV GUILD_ID=$GUILD_ID
ENV ACTIVITY=$ACTIVITY
ENV STATUS=$STATUS
ENV OWNERID=$OWNERID
ENV TZ=${TZ}

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN rm -rf /var/cache/apt/* /tmp/* 

CMD ["node", "index.js"]
