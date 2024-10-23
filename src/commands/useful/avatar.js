const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const { logger } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("I retrieve the avatar of the target user.")
        .addUserOption(option =>
            option.setName("target").setDescription("The target user").setRequired(true),
        )
        .addNumberOption(option =>
            option
                .setName("resolution")
                .setDescription("The resolution the image should be")
                .setChoices(
                    { name: "512", value: 512 },
                    { name: "1024", value: 1024 },
                    { name: "4096", value: 4096 },
                ),
        ),
    /** Retrieves the avatar of the target user
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            await interaction.deferReply();
            /** @type {import("discord.js").User} */
            const user = interaction.options.getUser("target");

            const res = interaction.options.getNumber("resolution") ?? 512;

            const img = user.avatarURL({ size: res });
            if (!img) {
                return await interaction.followUp("**[ NOTICE ]** I could not find the avatar.");
            }

            const color = user.accentColor ?? Colors.Green;

            const embed = new EmbedBuilder()
                .setTitle(`${user.username}'s Avatar`)
                .setImage(img)
                .setColor(color);

            await interaction.followUp({
                embeds: [embed],
            });
        } catch (error) {
            logger.error(error, "Error in avatar command");
            await interaction.followUp("**[ ERROR ]** There was an error retrieving the avatar.");
        }
    },
};
