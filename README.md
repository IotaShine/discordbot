# Discord Bot

This Discord bot is designed to enhance your Discord server with music playback, custom command interactions, and more.

## Features

-   Music playback from YouTube and Spotify
-   Dynamic command deployment
-   Server-specific configuration

## Installation

To get started with this bot, you can either pull the image and run it with Docker or run it locally.

### Docker

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
  ghcr.io/iotashine/discordbot:main
```

Or you can use docker compose:

```yml
version: '3'
services:
  thanujica:
    container_name: discordbot
    image: ghcr.io/iotashine/discordbot:main
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

### Locally

You can also run the bot locally by cloning the repository and installing the dependencies. For it you need to have [Node.js](https://nodejs.org/en/download/current) installed and [Git](https://git-scm.com/downloads).

```bash
git clone https://github.com/IotaShine/discordbot.git
cd discordbot
npm install
touch .env
echo "TOKEN=
CLIENT_ID=
GUILD_ID=
ACTIVITY=
STATUS=
OWNERID=" > .env
```

Then you'll need to fill in the `.env` file with your bot token, client ID, guild ID, activity, status, and owner ID.

Refresh the commands with:

```bash
npm run refresh-global
```

After that you can run the bot with:

```bash
npm run bot
```

## Configuration

The bot can be configured with the following environment variables

-   `TOKEN`
-   `CLIENT_ID`
-   `GUILD_ID`
-   `ACTIVITY`
-   `STATUS`
-   `OWNERID`

Tokens can be obtained from the [Discord Developer Portal](https://discord.com/developers/applications).

`GUILD_ID` `OWNERID` can be obtained by enabling developer mode in Discord and right-clicking on the server or user.

For the `ACTIVITY` and `STATUS` environment variables, you can use the following values:

-   `ACTIVITY`:
    -   PLAYING
    -   STREAMING
    -   LISTENING
    -   WATCHING
-   `STATUS`:
    -   online
    -   idle
    -   dnd
    -   invisible
