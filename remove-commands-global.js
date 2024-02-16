const { REST, Routes } = require("discord.js");
require("dotenv").config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const commands = [];


const rest = new REST().setToken(TOKEN);

(async () => {
    try {
        console.log("Removing application (/) commands.");

        await rest.put(Routes.applicationCommands(CLIENT_ID), {
            body: commands,
        });

        console.log("Successfully removed application (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();
