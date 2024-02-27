const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue, useMainPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playnext")
        .setDescription("Te agrego la cancion a la cola pero antes de todas las demás")
        .addStringOption(option =>
            option
                .setName("cancion")
                .setDescription("canción")
                .setRequired(true),
        ),

    /** Plays a song before all others
    * @param {CommandInteraction} interaction
    */
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            await interaction.reply("No estas en un canal de voz salame");
            return;
        }

        const { player } = interaction.client;
        const queue = useQueue(interaction.guild.id);

        if (!queue.connection) {
            await queue.connect(interaction.member.voice.channel);
        }

        await interaction.deferReply();

        try {
            const request = interaction.options.getString("cancion");

            const searchResult = await player.search(request);
            if (searchResult.isEmpty()) return interaction.followUp("No se encontraron resultados");
            const track = await searchResult.tracks[0];
            queue.insertTrack(track, 0);

            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Añadida cancion")
                .setDescription(`Añadido **[${track.title}]** a la cola`)
                .setImage(track.thumbnail)
                .setFooter({ text: `Duración: ${track.duration}` });

            return interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.followUp("Ando mal de la panza y hubo un error :nauseated_face:");
        }
    },
};
