FROM node:21-bookworm-slim
RUN apt-get update && apt-get install -y ffmpeg python3 python3-pip

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

CMD /bin/sh -c "npm run refresh-global && npm run bot"
