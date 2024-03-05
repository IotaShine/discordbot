const { SlashCommandBuilder } = require("discord.js");
const { logger, r34Helper } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder().setName("r34")
        .setDescription("I send you a random image from r34. Perfect for degenerates like you.")
        .addStringOption(option => option
            .setName("tag")
            .setDescription("Character or tag to search for.")
            .setRequired(true),
        )
        .setNSFW(true),

    /** Sends a random image from r34 api
    * @param {import("discord.js").CommandInteraction} interaction
    */
    async execute(interaction) {
        if (!interaction.channel.nsfw) return await interaction.reply("**[ WARNING ]** This command can only be used in NSFW channels.");
        await interaction.deferReply();
        const character = interaction.options.getString("tag");
        try {
            const img = await r34Helper(`${character} `);
            return interaction.followUp(
                { content: `**[ NOTICE ]** Image from ${character} attached`, files: [img] },
            );
        } catch (error) {
            logger.error(error, "Error in r34 command");
            await interaction.followUp("**[ ERROR ]** Something unexpected has happened.");
        }
    },
};
