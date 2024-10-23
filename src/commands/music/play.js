const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useMainPlayer } = require("discord-player");
const { logger } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("i sing you a song.")
        .addStringOption(option =>
            option.setName("song").setDescription("The song to play").setRequired(true),
        ),

    /** Plays a song
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (!channel) {
            return await interaction.reply("**[ NOTICE ]** You need to be in a voice channel.");
        }
        const query = interaction.options.getString("song");
        const player = useMainPlayer();

        await interaction.deferReply();

        try {
            const { track } = await player.play(interaction.member.voice.channel, query, {
                requestedBy: interaction.user,
                nodeOptions: {
                    metadata: interaction,
                },
            });

            const embed = new EmbedBuilder();
            embed.setColor("Red");

            if (track.playlist) {
                embed
                    .setTitle("🎵 **[ PLAYLIST ]** 🎵")
                    .setFields([
                        { name: "Playlist", value: track.playlist.title, inline: true },
                        {
                            name: "Added",
                            value: `${track.playlist.tracks.length} songs to the queue`,
                            inline: true,
                        },
                    ])
                    .setImage(track.thumbnail)
                    .setFooter({ text: `Requested by ${interaction.user.tag}` });
            } else {
                embed
                    .setTitle("🎵 **[ TRACK ]** 🎵")
                    .setFields([
                        { name: "Title", value: track.title, inline: true },
                        { name: "Duration", value: track.duration, inline: true },
                    ])
                    .setImage(track.thumbnail)
                    .setFooter({ text: `Requested by ${interaction.user.tag}` });
            }

            return interaction.followUp({ embeds: [embed] });
        } catch (error) {
            logger.error(error, "Error in play command");
            return interaction.followUp("**[ ERROR ]** There was an error playing the song.");
        }
    },
};
