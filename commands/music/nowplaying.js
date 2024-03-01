const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
const { logger } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("que pija estas escuchando"),


    /** Sends the current track
    * @param {import("discord.js").Interaction} interaction
    */
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            await interaction.reply("No estas en un canal de voz salame");
            return;
        }

        await interaction.deferReply();
        const queue = useQueue(interaction.guild.id);
        if (!queue) return await interaction.followUp("No hay nada sonando, imbécil");

        try {
            const { currentTrack } = queue;
            if (!currentTrack) throw new Error("Now playing track not found");

            return await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Esta sonando:")
                        .setDescription(`[${currentTrack.raw.title}](${currentTrack.url})`)
                        .setFooter({ text: `Duración: [${currentTrack.duration}]` })
                        .setThumbnail(currentTrack.thumbnail)
                        .setColor("Random"),
                ],
            });
        } catch (error) {
            logger.error(error, "Error in nowplaying command");
            return await interaction.followUp("Ocurrió un error al ejecutar el comando");
        }
    },
};
