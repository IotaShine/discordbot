const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

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

        await interaction.deferReply();
        try {
            const queue = useQueue(interaction.guild.id);
            if (!queue) return await interaction.followUp("No hay canciones sonando");

            const { node, currentTrack, tracks } = queue;
            const nextTrack = tracks.data[0];
            await node.skip();

            return await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Skipeando **[${currentTrack.raw.title}]** ⏭`)
                        .setColor("Random")
                        .setDescription(`**[${nextTrack.raw.title}]** va a sonar ahora`)
                        .setThumbnail(nextTrack.thumbnail),
                ],
            });
        } catch (error) {
            console.log(error);
            return await interaction.followUp("Ocurrió un error");
        }
    },
};
