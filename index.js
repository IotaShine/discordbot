const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { Player } = require("discord-player");
const { YoutubeExtractor } = require("@discord-player/extractor");
require("dotenv").config();
const { ACTIVITY, STATUS, TOKEN } = process.env;
const sqlite3 = require("sqlite3").verbose();
const { createTables } = require("./helpers/config/db.js");
const shutdownHandler = require("./helpers/config/shutdownHandler.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

// Importar todos los comandos
client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

// Iteramos las carpetas
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    // Por cada archivo en la carpeta actual iteramos los comandos y los importamos
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
            console.log(`[ SUCCESS ] - Command ${file} was loaded.`);
        } else {
            console.log(
                `[ WARNING ] - The command at ${path.join(
                    filePath,
                    file,
                )} couldn't be loaded, It may be missing a 'data' or 'execute' property.`,
            );
        }
    }
}

// Importar todos los eventos

const eventsPath = path.join(__dirname, "events");
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

// Agregamos el reproductor de música
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
    },
});

client.player.extractors.register(YoutubeExtractor, {});

// agregamos la base de datos
const db = new sqlite3.Database(path.join(__dirname, "database/discordDB.sqlite3"), err => {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }
    console.log("Connected to database successfully.");
});
client.db = db;
createTables(db);

shutdownHandler(client);

// Login del bot
client
    .login(TOKEN)
    .then(() => {
        client.user.setPresence({
            activities: [{ name: ACTIVITY }],
            status: STATUS,
        });
        console.log("Bot description status changed");
    })
    .catch(error => {
        console.log(error);
        console.log("There was an error while logging in");
        process.exit(1);
    });
