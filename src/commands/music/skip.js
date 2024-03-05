const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
const { logger } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("I skip the current track."),

    /** Skips the current track
    * @param {import("discord.js").CommandInteraction} interaction
    */
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            return await interaction.reply("**[ NOTICE ]** You need to be in a voice channel.");
        }

        await interaction.deferReply();
        try {
            const queue = useQueue(interaction.guild.id);
            if (!queue) return await interaction.followUp("**[ NOTICE ]** No music is playing.");

            const { node, currentTrack, tracks } = queue;
            const nextTrack = tracks.data[0];
            const description = nextTrack ? `**[${nextTrack.raw.title}]**\n Is going to play now` : "There is nothing left to play.";
            node.skip();

            return await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("**[ SKIPPING ]**")
                        .setDescription(description)
                        .setThumbnail(nextTrack?.thumbnail ?? currentTrack.thumbnail)
                        .setColor("Random"),
                ],
            });
        } catch (error) {
            logger.error(error, "Error in skip command");
            return await interaction.followUp("**[ ERROR ]** There was an error skipping the track.");
        }
    },
};
