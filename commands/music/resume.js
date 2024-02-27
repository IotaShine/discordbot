const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("le doy play de vuelta a la música"),

    /** Resumes the current track
    * @param {CommandInteraction} interaction
    */
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            return await interaction.reply("No estas en un canal de voz salame");
        }

        await interaction.deferReply();
        try {
            const queue = useQueue(interaction.guild.id);
            const { currentTrack, node } = queue;
            node.setPaused(false);

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
            return await interaction.followUp("Ocurrió un error");
        }
    },
};
