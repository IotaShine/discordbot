const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("skipeo la canción que esta sonando"),

    /** Skips the current track
    * @param {CommandInteraction} interaction
    */
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            return await interaction.reply("No estas en un canal de voz salame");
        }

        // TODO - Change the the message to show the song that is going to play now and the song that was skipped
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
            return await interaction.followUp("Ocurrió un error");
        }
    },
};
