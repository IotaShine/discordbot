const { SlashCommandBuilder } = require("discord.js");
const logger = require("../../helpers/config/logger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("comando para invitarme a otros servers"),

    /** Sends the invite link
    * @param {CommandInteraction} interaction
    */
    async execute(interaction) {
        try {
            await interaction.reply(
                "Podes invitarme haciendo [click aca](https://discord.com/api/oauth2/authorize?client_id=959872678884425768&permissions=17740865203414&scope=bot)",
            );
        } catch (error) {
            logger.error(error, "Error in invite command");
            return await interaction.reply("Ocurrió un pequeño errorcito");
        }
    },
};
