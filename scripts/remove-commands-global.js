const { REST, Routes } = require("discord.js");
const { logger } = require("../src/helpers");
require("dotenv").config({ path: "../.env" });

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const commands = [];


const rest = new REST().setToken(TOKEN);

(async () => {
    try {
        logger.info("Removing application (/) commands.");

        await rest.put(Routes.applicationCommands(CLIENT_ID), {
            body: commands,
        });

        logger.info("Successfully removed application (/) commands.");
    } catch (error) {
        logger.error(error);
    }
})();
