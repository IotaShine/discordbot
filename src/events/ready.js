const { Events } = require("discord.js");
const { logger } = require("../helpers/");

module.exports = {
    name: Events.ClientReady,
    once: true,
    /** Runs when the bot starts
     * @param {import("discord.js").Client} client
     */
    execute(client) {
        logger.info(`Bot ready, Logged in as ${client.user.tag}`);
    },
};
