# Discord Bot

This Discord bot is designed to enhance your Discord server with music playback, custom command interactions, and more.

## Features

- Music playback from YouTube and Spotify
- Dynamic command deployment
- Server-specific configuration

## Installation

To get started with this bot, you can either pull the image and run it with Docker or run it locally.

```bash
docker run -d \
  --name discordbot \
  --restart unless-stopped \
  -v [path to store the database]:/bot/database \
  -e TOKEN=${TOKEN} \
  -e CLIENT_ID=${CLIENT_ID} \
  -e GUILD_ID=${GUILD_ID} \
  -e ACTIVITY=${ACTIVITY} \
  -e STATUS=${STATUS} \
  -e OWNERID=${OWNERID} \
  iotashine/discordbot
```

Or you can use docker compose:
```yml
version: '3'
services:
  thanujica:
    container_name: discordbot
    image: iotashine/discordbot
    restart: unless-stopped
    volumes:
      - [path to store the database]:/bot/database
    environment:
      - TOKEN=${TOKEN}
      - CLIENT_ID=${CLIENT_ID}
      - GUILD_ID=${GUILD_ID}
      - ACTIVITY=${ACTIVITY}
      - STATUS=${STATUS}
      - OWNERID=${OWNERID}
```

