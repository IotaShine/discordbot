const { Events } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Bot ready, Logged in as ${client.user.tag}`);
    },
};
