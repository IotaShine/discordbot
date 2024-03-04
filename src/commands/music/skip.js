const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
const { logger } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("skipeo la canción que esta sonando"),

    /** Skips the current track
    * @param {import("discord.js").CommandInteraction} interaction
    */
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            return await interaction.reply("No estas en un canal de voz salame");
        }

        await interaction.deferReply();
        try {
            const queue = useQueue(interaction.guild.id);
            if (!queue) return await interaction.followUp("No hay canciones sonando");

            const { node, currentTrack, tracks } = queue;
            const nextTrack = tracks.data[0];
            const description = nextTrack ? `**[${nextTrack.raw.title}]** va a sonar ahora` : "No hay mas canciones en la lista";
            await node.skip();

            return await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Skipeando ⏭ **[${currentTrack.raw.title}]**`)
                        .setColor("Random")
                        .setDescription(description)
                        .setThumbnail(nextTrack?.thumbnail ?? currentTrack.thumbnail),
                ],
            });
        } catch (error) {
            logger.error(error, "Error in skip command");
            return await interaction.followUp("Ocurrió un error");
        }
    },
};
