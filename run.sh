#!/bin/sh

npm install /bot
touch .env

cat << EOF > .env
TOKEN=$TOKEN
CLIENT_ID=$CLIENT_ID
GUILD_ID=$GUILD_ID
ACTIVITY="$ACTIVITY"
STATUS=$STATUS
OWNERID=$OWNERID
EOF

node /bot/index.js
