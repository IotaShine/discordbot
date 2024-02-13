const { REST, Routes } = require("discord.js");
require("dotenv").config();

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CLIENT_ID = process.env.CLIENT_ID;

const commands = [];

const rest = new REST().setToken(TOKEN);

(async () => {
    try {
        console.log("Removing application (/) commands.");

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands },
        );

        console.log("Successfully removed application (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();
