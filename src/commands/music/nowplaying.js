const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
const { logger } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("I show you the current track."),

    /** Sends the current track
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            await interaction.reply("**[ WARNING ]** You need to be in a voice channel.");
            return;
        }

        await interaction.deferReply();
        const queue = useQueue(interaction.guild.id);
        if (!queue) return await interaction.followUp("**[ NOTICE ]** No music is playing.");

        try {
            const { currentTrack } = queue;
            if (!currentTrack) throw new Error();

            const { title, url, duration, requestedBy, thumbnail } = currentTrack;

            return await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("**[ CURRENT TRACK ]**")
                        .setFields([
                            { name: "Title", value: `[${title}](${url})`, inline: true },
                            { name: "Duration", value: duration, inline: true },
                        ])
                        .setFooter({ text: `Requested by ${requestedBy?.tag}` })
                        .setImage(thumbnail)
                        .setColor("Random"),
                ],
            });
        } catch (error) {
            logger.error(error, "Error in nowplaying command");
            return await interaction.followUp(
                "**[ ERROR ]** There was an error getting the current track.",
            );
        }
    },
};
