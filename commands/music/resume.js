const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("le doy play de vuelta a la musica"),

    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            return await interaction.reply("No estas en un canal de voz salame");
        }

        await interaction.deferReply();
        try {
            const { node, currentTrack } = await interaction.client.player.nodes.get(
                interaction.guild.id,
            );

            await node.resume();
            return await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Reanudando...")
                        .setColor("Random")
                        .setDescription(`**[${currentTrack.raw.title}]** reanudado`)
                        .setFooter({ text: `Duración: ${currentTrack.duration}` })
                        .setThumbnail(currentTrack.thumbnail),
                ],
            });
        } catch (error) {
            console.log(error);
            return await interaction.followUp("Ocurrio un error");
        }
    },
};
