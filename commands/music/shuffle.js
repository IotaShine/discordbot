const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Mezclo la cola de reproducción"),
    /** Shuffles the queue
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction) {
        if (!interaction.member.voice.channel) return await interaction.reply("No estas en un canal de voz salame");

        const queue = useQueue(interaction.guild.id);
        if (queue.size < 2) return await interaction.reply("No hay suficientes canciones en la cola");

        queue.tracks.shuffle();

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Cola mezclada")
            .setDescription("La cola de reproducción ha sido mezclada");

        return await interaction.reply({ embeds: [embed] });
    },
};