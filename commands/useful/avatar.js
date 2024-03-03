const { SlashCommandBuilder } = require("discord.js");
const { logger } = require("../../helpers/");

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
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            const user = interaction.options.getUser("target");

            const img = user.avatarURL({ size: 4096, extension: "png" });
            if (!img) return await interaction.reply("No pude encontrar la foto de ese usuario.");

            await interaction.reply({
                content: `Avatar de ${interaction.options.getUser("target").username}`,
                files: [img],
            });
        } catch (error) {
            logger.error(error, "Error in avatar command");
            await interaction.reply("Na ni idea que paso, pero no pude hacerlo.");
        }
    },
};
