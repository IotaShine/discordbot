const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
const { logger } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder().setName("queue").setDescription("I show you the queue."),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            await interaction.reply("**[ NOTICE ]** You need to be in a voice channel.");
            return;
        }

        const queue = useQueue(interaction.guild.id);
        if (!queue) return await interaction.reply("**[ NOTICE ]** No music is playing.");

        const { data } = queue.tracks;

        if (!data || data.length === 0) {
            return await interaction.reply("**[ NOTICE ]** No music is playing.");
        }

        await interaction.deferReply();

        try {
            const { currentTrack, durationFormatted } = queue;
            const songs = [currentTrack, ...data];
            const canciones = songs
                .slice(0, 10)
                .map((s, i) => {
                    const { duration, url } = s;
                    const { title } = s;
                    return `${i + 1}. [${title}](${url}) - [${duration}]`;
                })
                .join("\n");

            return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Random")
                        .setThumbnail(currentTrack.thumbnail)
                        .setTitle("**[ QUEUE ]**")
                        .setDescription(canciones)
                        .setFooter({
                            text: `Song in the queue: ${songs.length}\nDuration: ${durationFormatted}`,
                        }),
                ],
            });
        } catch (error) {
            logger.error(error, "Error in queue command");
            return interaction.followUp("**[ ERROR ]** There was an error getting the queue.");
        }
    },
};
