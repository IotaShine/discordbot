const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue, useMainPlayer } = require("discord-player");
const { logger } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playnext")
        .setDescription("The next song you wish to play.")
        .addStringOption(option =>
            option
                .setName("song")
                .setDescription("The song to play")
                .setRequired(true),
        ),

    /** Plays a song before all others
    * @param {import("discord.js").CommandInteraction} interaction
    */
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            await interaction.reply("**[ NOTICE ]** You need to be in a voice channel.");
            return;
        }

        const player = useMainPlayer();
        const queue = useQueue(interaction.guild.id);

        if (!queue.connection) {
            await queue.connect(interaction.member.voice.channel);
        }

        await interaction.deferReply();

        try {
            const request = interaction.options.getString("song");

            const searchResult = await player.search(request);
            if (searchResult.isEmpty()) return interaction.followUp("**[ NOTICE ]** No results found.");
            const track = searchResult.tracks[0];
            queue.insertTrack(track, 0);

            const embed = new EmbedBuilder()
                .setTitle("🎵 **[ ADDED ]** 🎵")
                .setDescription(`**[${track.title}]**\nHas been added to the queue.`)
                .setImage(track.thumbnail)
                .setColor("Red")
                .setFooter({ text: `Duration: ${track.duration}` });

            return interaction.followUp({ embeds: [embed] });
        } catch (error) {
            logger.error(error, "Error in playnext command");
            return interaction.followUp("**[ ERROR ]** There was an error playing the song.");
        }
    },
};
