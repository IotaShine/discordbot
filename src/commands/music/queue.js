const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
const { logger } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder().setName("queue").setDescription("muestra que esta en cola"),

    /**
     * @param {import("discord.js").CommandInteraction} interaction 
     */
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            await interaction.reply("No estas en un canal de voz salame");
            return;
        }

        const queue = useQueue(interaction.guild.id);
        if (!queue) return await interaction.reply("La cola esta vacía negro");

        const { data } = queue.tracks;

        if (!data || data.length === 0) {
            return await interaction.reply("La cola esta vacía negro");
        }

        await interaction.deferReply();

        try {
            const { currentTrack, durationFormatted } = queue;
            const songs = [currentTrack, ...data];
            const canciones = songs
                .slice(0, 10)
                .map((s, i) => {
                    const { duration, url } = s;
                    const { title } = s.raw;
                    return `${i + 1}. [${title}](${url}) - [${duration}]`;
                })
                .join("\n");

            return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Random")
                        .setThumbnail(currentTrack.thumbnail)
                        .setTitle("Canciones en cola")
                        .setDescription(canciones)
                        .setFooter({
                            text: `Canciones en cola: ${songs.length}\nDuración: ${durationFormatted}`,
                        }),
                ],
            });
        } catch (error) {
            logger.error(error, "Error in queue command");
            return interaction.followUp("Ocurrió un error");
        }
    },
};
