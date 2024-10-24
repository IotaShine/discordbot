const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { Player } = require("discord-player");
// const { YoutubeExtractor } = require("@discord-player/extractor");
const { YoutubeiExtractor } = require("discord-player-youtubei");
require("dotenv").config();
const { ACTIVITY, STATUS, TOKEN, CLIENT_ID } = process.env;
const { logger, createTables, shutdownHandler } = require("./src/helpers");
const db = require("./src/helpers/db/database");
const checkFirstRun = require("./scripts/first-run-check");
const onPlayerStart = require("./src/helpers/music/playerStart");

// FIXME - Remove the db from the client and use the db from the helpers/db/database.js
// FIXME - Fix date and time in docker container

/** Refrescamos los comandos */

if (!TOKEN) {
    logger.fatal("No token was provided, please provide one in the .env file.");
    process.exit(1);
}

if (!CLIENT_ID) {
    logger.fatal("No client id was provided, please provide one in the .env file.");
    process.exit(1);
}

if (!ACTIVITY) {
    logger.warn("No activity was provided, the bot will use the default one.");
}

if (!STATUS) {
    logger.warn("No status was provided, the bot will use the default one.");
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

/** Importar todos los comandos */
client.commands = new Collection();
const foldersPath = path.join(__dirname, "src/commands");
const commandFolders = fs.readdirSync(foldersPath);

/** Iteramos las carpetas */
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    /** Por cada archivo en la carpeta actual iteramos los comandos y los importamos */
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);

            logger.info(`Command ${file} was loaded.`);
        } else {
            logger.warn(
                `The command at ${path.join(
                    filePath,
                    file,
                )} couldn't be loaded, It may be missing a 'data' or 'execute' property.`,
            );
        }
    }
}

/** Importar todos los eventos */
const eventsPath = path.join(__dirname, "src/events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

/** Agregamos el reproductor de música */
const player = new Player(client);
player.extractors.register(YoutubeiExtractor, {});

player.events.on("playerStart", onPlayerStart);

player.on("error", (queue, error) => {
    logger.error(`Error en la cola ${queue.guild.id}: ${error.message}`);
});

/** Inicializamos y agregamos la base de datos */
createTables(db);

shutdownHandler(client);

/** Verificamos si es la primera vez que se ejecuta el bot */
checkFirstRun();

/** Login del bot */
client
    .login(TOKEN)
    .then(() => {
        client.user.setPresence({
            activities: [{ name: ACTIVITY || "with your feelings" }],
            status: STATUS || "online",
        });
        logger.info("Bot description status changed");
    })
    .catch(error => {
        logger.fatal("There was an error while logging in");
        logger.fatal(error);
        process.exit(1);
    });
