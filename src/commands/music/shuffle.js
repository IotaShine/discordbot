const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("I shuffle the queue."),
    /** Shuffles the queue
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction) {
        if (!interaction.member.voice.channel) return await interaction.reply("**[ NOTICE ]** You need to be in a voice channel.");

        const queue = useQueue(interaction.guild.id);
        if (queue.size < 2) return await interaction.reply("**[ NOTICE ]** There are not enough tracks to shuffle.");

        queue.tracks.shuffle();

        const embed = new EmbedBuilder()
            .setTitle("**[ SHUFFLED ]**")
            .setDescription("The queue has been shuffled.")
            .setColor("Red");

        return await interaction.reply({ embeds: [embed] });
    },
};