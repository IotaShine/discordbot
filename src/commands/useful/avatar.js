const { SlashCommandBuilder } = require("discord.js");
const { logger } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("I retrieve the avatar of the target user.")
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("The target user")
                .setRequired(true),
        ),
    /** Retrieves the avatar of the target user
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            const user = interaction.options.getUser("target");

            const img = user.avatarURL({ size: 4096, extension: "png" });
            if (!img) return await interaction.reply("**[ NOTICE ]** I could not find the avatar.");

            await interaction.reply({
                content: `${interaction.options.getUser("target").username}'s avatar`,
                files: [img],
            });
        } catch (error) {
            logger.error(error, "Error in avatar command");
            await interaction.reply("**[ ERROR ]** There was an error retrieving the avatar.");
        }
    },
};
