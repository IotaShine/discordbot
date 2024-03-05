const { SlashCommandBuilder } = require("discord.js");
const { logger } = require("../../helpers");
const { useQueue, QueueRepeatMode } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("I repeat the queue until time itself ceases to exist."),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            const queue = useQueue(interaction.guild.id);

            if (!queue || !queue.currentTrack) {
                await interaction.reply("**[ NOTICE ]** There's no music to loop.");
                return;
            }

            if (queue.repeatMode === QueueRepeatMode.QUEUE) {
                queue.setRepeatMode(QueueRepeatMode.OFF);
                return await interaction.reply("**[ SUCCESS ]** I stopped looping the queue.");
            }

            queue.setRepeatMode(QueueRepeatMode.QUEUE);
            await interaction.reply("**[ SUCCESS ]** I'll loop the queue until time itself ceases to exist.");

        } catch (error) {
            logger.error(error, "Error in loop command");
            await interaction.reply("**[ ERROR ]** There was an error looping the queue.");
        }

    },
};