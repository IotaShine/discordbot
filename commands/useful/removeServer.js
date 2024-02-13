const { SlashCommandBuilder } = require("discord.js");
const modifyServer = require("../../helpers/twitterFixer/modifyServer");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removeserver")
        .setDescription("Remove from the functionality to have twitter links fixed"),
    async execute(interaction) {
        const serverId = interaction.guild.id;

        const response = await modifyServer(serverId);

        return await interaction.reply(response);
    },
};
