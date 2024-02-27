const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

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
        if (!interaction.member.voice.channel) {
            await interaction.reply("No estas en un canal de voz salame");
            return;
        }

        const queue = useQueue(interaction.guild);
        if (!queue.connection) {
            await queue.connect(interaction.member.voice.channel);
        }

        await interaction.deferReply();

        try {
            const request = interaction.options.getString("cancion");
            const { track } = await queue.play(request);

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
            return interaction.followUp(
                `Ando mal de la panza y hubo un error :nauseated_face: :\n\`\`\`${error}\`\`\``,
            );
        }
    },
};
