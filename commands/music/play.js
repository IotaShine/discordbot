const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useMainPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Me pongo modo DJ y me pongo a cantar")
        .addStringOption(option =>
            option
                .setName("cancion")
                .setDescription("canción")
                .setRequired(true),
        ),

    /** Plays a song
    * @param {CommandInteraction} interaction
    */
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (!channel) return await interaction.reply("No estas en un canal de voz salame");
        const query = interaction.options.getString("cancion");
        const player = useMainPlayer();

        await interaction.deferReply();

        try {
            const { track } = await player.play(interaction.member.voice.channel, query);

            const embed = new EmbedBuilder();
            embed.setColor("Red");

            if (track.playlist) {
                embed
                    .setTitle("Añadida cancion :notes:")
                    .setDescription(`Añadido **[ ${track.playlist.title} ]** a la cola`)
                    .setImage(track.thumbnail)
                    .setFooter({
                        text: `Añadidas: ${track.playlist.tracks.length} canciones`,
                    });
            } else {
                embed
                    .setTitle("Añadida cancion")
                    .setDescription(`Añadido **[${track.title}]** a la cola`)
                    .setImage(track.thumbnail)
                    .setFooter({ text: `Duración: ${track.duration}` });
            }

            return interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.followUp("Ando mal de la panza y hubo un error :nauseated_face:");
        }
    },
};
