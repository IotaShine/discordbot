const { SlashCommandBuilder } = require("discord.js");
const { logger } = require("../../helpers");
const { useQueue, QueueRepeatMode } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("loop la musiquita que esta sonando"),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            const queue = useQueue(interaction.guild.id);

            if (!queue || !queue.currentTrack) {
                await interaction.reply("No hay nada sonando para repetir");
                return;
            }

            if (queue.repeatMode === QueueRepeatMode.QUEUE) {
                queue.setRepeatMode(QueueRepeatMode.OFF);
                return await interaction.reply("La musiquita no se va a repetir más");
            }

            queue.setRepeatMode(QueueRepeatMode.QUEUE);
            await interaction.reply("La musiquita se va a repetir hasta que te canses");

        } catch (error) {
            logger.error(error, "Error in loop command");
            await interaction.reply("Me cagué, no pude hacerlo.");
        }

    },
};