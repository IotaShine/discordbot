const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("que pija estas escuchando"),


    /** Sends the current track
    * @param {CommandInteraction} interaction
    */
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            await interaction.reply("No estas en un canal de voz salame");
            return;
        }

        await interaction.deferReply();
        const queue = await interaction.client.player.nodes.get(interaction.guild.id);
        if (!queue) return await interaction.followUp("No hay nada sonando, imbécil");

        try {
            const { currentTrack } = queue;
            if (!currentTrack) throw new Error();
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
            console.log(error);
            return await interaction.followUp("Ocurrió un error al ejecutar el comando");
        }
    },
};
