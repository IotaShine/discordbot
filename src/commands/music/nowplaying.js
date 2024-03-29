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

            return await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("**[ CURRENT TRACK ]**")
                        .setDescription(`[${currentTrack.raw.title}](${currentTrack.url})`)
                        .setFooter({ text: `Duration: **[ ${currentTrack.duration} ]**` })
                        .setThumbnail(currentTrack.thumbnail)
                        .setColor("Random"),
                ],
            });
        } catch (error) {
            logger.error(error, "Error in nowplaying command");
            return await interaction.followUp("**[ ERROR ]** There was an error getting the current track.");
        }
    },
};
