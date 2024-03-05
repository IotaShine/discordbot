const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
const { logger } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("I allow the flow of time and music to continue."),

    /** Resumes the current track
    * @param {import("discord.js").CommandInteraction} interaction
    */
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            return await interaction.reply("**[ NOTICE ]** You need to be in a voice channel.");
        }

        await interaction.deferReply();
        try {
            const queue = useQueue(interaction.guild.id);
            const { currentTrack, node } = queue;
            node.setPaused(false);

            return await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("**[ RESUMING ]**")
                        .setColor("Random")
                        .setDescription(`**[${currentTrack.raw.title}]**`)
                        .setFooter({ text: `Duration: ${currentTrack.duration}` })
                        .setThumbnail(currentTrack.thumbnail),
                ],
            });
        } catch (error) {
            logger.error(error, "Error in resume command");
            return await interaction.followUp("**[ ERROR ]** There was an error resuming the track.");
        }
    },
};
