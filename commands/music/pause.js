const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("pause").setDescription("te pauso la música"),

    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            return await interaction.reply("No estas en un canal de voz salame");
        }

        /** Pauses the current track
        * @param {CommandInteraction} interaction
        */
        await interaction.deferReply();
        try {
            const { node, currentTrack } = await interaction.client.player.nodes.get(
                interaction.guild.id,
            );

            await node.pause();
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
            console.log(error);
            return await interaction.followUp("Ocurrió un error");
        }
    },
};
