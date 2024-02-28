const { Events } = require("discord.js");
const logger = require("../helpers/config/logger");

module.exports = {
    name: Events.ClientReady,
    once: true,
    /** Runs when the bot starts
     * @param {Client} client
     */
    execute(client) {
        logger.info(`Bot ready, Logged in as ${client.user.tag}`);
    },
};
