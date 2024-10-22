const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js");
const { logger } = require("../src/helpers");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

(function updateGuildCommands() {
    const TOKEN = process.env.TOKEN;
    const GUILD_ID = process.env.GUILD_ID;
    const CLIENT_ID = process.env.CLIENT_ID;

    const commands = [];

    const foldersPath = path.join(__dirname, "../src/commands");
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ("data" in command && "execute" in command) {
                logger.info(`[ LOADING ] ${command.data.name}`);
                commands.push(command.data.toJSON());
            } else {
                logger.warn(
                    `The command at ${filePath} is missing a required "data" or "execute" property.`,
                );
            }
        }
    }

    const rest = new REST().setToken(TOKEN);

    (async () => {
        try {
            logger.info(`Started refreshing ${commands.length} application (/) commands.`);

            const data = await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
                body: commands,
            });

            logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            logger.error(error);
        }
    })();
})();

// module.exports = updateGuildCommands;
