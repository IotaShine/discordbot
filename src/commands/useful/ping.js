const { SlashCommandBuilder } = require("discord.js");
const { logger } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder().setName("ping").setDescription("pong"),
    /** Sends pong
    * @param {import("discord.js").CommandInteraction} interaction
    */
    async execute(interaction) {

        try {
            const ping = Date.now() - interaction.createdTimestamp;
            await interaction.reply("pong");

            const reply = await interaction.fetchReply();
            const pong = Date.now() - reply.createdTimestamp;
            await interaction.editReply(`pong! \nPing: ${ping}ms \nPong: ${pong}ms`);

        } catch (error) {
            logger.error(error, "Error in ping command");
            return await interaction.reply("**[ ERROR ]** There was an error.");
        }

    },
};
