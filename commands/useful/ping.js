const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("ping").setDescription("pong"),
    /** Sends pong
    * @param {CommandInteraction} interaction
    */
    async execute(interaction) {
        await interaction.reply("Pong!");
    },
};
