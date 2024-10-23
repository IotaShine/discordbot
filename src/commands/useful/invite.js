const { SlashCommandBuilder } = require("discord.js");
const { logger } = require("../../helpers/");
const { CLIENT_ID } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("I send the invite link."),

    /** Sends the invite link
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            await interaction.reply({
                content: `You can invite me by [clicking here](https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=17740865203414&scope=bot)`,
                ephemeral: true,
            });
        } catch (error) {
            logger.error(error, "Error in invite command");
            return await interaction.reply(
                "**[ ERROR ]** There was an error sending the invite link.",
            );
        }
    },
};
