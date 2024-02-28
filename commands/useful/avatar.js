const { SlashCommandBuilder } = require("discord.js");
const logger = require("../../helpers/config/logger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("te respondo con la fotito del que menciones")
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("The user you want the avatar")
                .setRequired(true),
        ),
    /** Retrieves the avatar of the target user
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            await interaction.reply(
                (await interaction.options.getUser("target").avatarURL()) + "?size=1024",
            );
        } catch (error) {
            logger.error(error, "Error in avatar command");
            await interaction.reply("Ocurrió un error");
        }
    },
};
