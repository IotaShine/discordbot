const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
const { logger } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder().setName("pause").setDescription("I stop time and so does the music."),

    /** Pauses the current track
    * @param {import("discord.js").CommandInteraction} interaction
    */
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            return await interaction.reply("**[ WARNING ]** You need to be in a voice channel.");
        }

        await interaction.deferReply();
        try {
            const queue = useQueue(interaction.guild.id);
            const { currentTrack, node } = queue;
            node.setPaused(true);

            return await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("**[ PAUSED ]**")
                        .setColor("Random")
                        .setDescription(`**[${currentTrack.raw.title}]**\nHas been paused.`)
                        .setFooter({ text: `Duration: ${currentTrack.duration}` })
                        .setThumbnail(currentTrack.thumbnail),
                ],
            });
        } catch (error) {
            logger.error(error, "Error in pause command");
            return await interaction.followUp("**[ ERROR ]** There was an error pausing the track.");
        }
    },
};
