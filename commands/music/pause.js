const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
const logger = require("../../helpers/config/logger");

module.exports = {
    data: new SlashCommandBuilder().setName("pause").setDescription("te pauso la música"),

    /** Pauses the current track
    * @param {import("discord.js").Interaction} interaction
    */
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            return await interaction.reply("No estas en un canal de voz salame");
        }

        await interaction.deferReply();
        try {
            const queue = useQueue(interaction.guild.id);
            const { currentTrack, node } = queue;
            node.setPaused(true);

            return await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Pausando...")
                        .setColor("Random")
                        .setDescription(`**[${currentTrack.raw.title}]** pausado`)
                        .setFooter({ text: `Duración: ${currentTrack.duration}` })
                        .setThumbnail(currentTrack.thumbnail),
                ],
            });
        } catch (error) {
            logger.error(error, "Error in pause command");
            return await interaction.followUp("Ocurrió un error");
        }
    },
};
