const { Events } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    /** Runs when the bot starts
     * @param {Client} client
     */
    execute(client) {
        console.log(`Bot ready, Logged in as ${client.user.tag}`);
    },
};
