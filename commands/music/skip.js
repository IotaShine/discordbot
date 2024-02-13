const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("skipeo la cancion que esta sonando"),

    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            return await interaction.reply("No estas en un canal de voz salame");
        }

        await interaction.deferReply();
        try {
            const { node, currentTrack } = await interaction.client.player.nodes.get(
                interaction.guild.id,
            );

            await node.skip();
            return await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Skipeando...")
                        .setColor("Random")
                        .setDescription(`**[${currentTrack.raw.title}]** skipeado`)
                        .setThumbnail(currentTrack.thumbnail),
                ],
            });
        } catch (error) {
            console.log(error);
            return await interaction.followUp("Ocurrio un error");
        }
    },
};
