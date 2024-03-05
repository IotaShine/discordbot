const { EmbedBuilder } = require("discord.js");
const { Track } = require("discord-player");
const { useMainPlayer } = require("discord-player");
const logger = require("../config/logger");
const db = require("../db/database");

/**
 * Retrieves the playlist from the database
 * @param {string} user_id
 * @param {string} nombre
 */
const playlistPlay = async (user_id, nombre) => {
    const sql = "SELECT * FROM playlists WHERE creator = ? AND nombre = ?";

    return new Promise((resolve, reject) => {
        db.get(sql, [user_id, nombre], (err, row) => {
            if (err) return reject(err);
            if (!row || row == undefined) return reject(new Error("No existe una playlist con ese nombre"));

            resolve(row);
        });
    });
};

/**
* Handles the discord interaction of playing a playlist
* @param {import("discord.js").CommandInteraction} interaction
*/
const play = async (interaction) => {
    if (!interaction.member.voice.channel) {
        return await interaction.reply("**[ NOTICE ]** You need to be in a voice channel.");
    }

    const player = useMainPlayer();

    const queue = player.queues.create(interaction.guild);

    if (!queue.connection) {
        await queue.connect(interaction.member.voice.channel);
    }

    await interaction.deferReply();

    const nombre = interaction.options.getString("playlist");
    const user_id = interaction.user.id;
    try {
        const request = await playlistPlay(user_id, nombre);

        if (!request || request == undefined) {
            return await interaction.followUp("**[ NOTICE ]** There isn't a playlist with that name.");
        }

        const temas = await JSON.parse(request.songs);
        const playlist = await temas.map(song => new Track(player, { ...song }));

        const embed = new EmbedBuilder()
            .setTitle(`Starting to play: **【${nombre}】**`)
            .setColor("Random")
            .setThumbnail(playlist[0].thumbnail)
            .setDescription(
                playlist
                    .slice(0, 10)
                    .map((song, i) => {
                        return `${i + 1}. [${song.raw.title}](${song.url}) - [${song.duration}]`;
                    })
                    .join("\n"),
            )
            .setFooter({ text: "Only the first 10 song appear." });

        await queue.play(playlist[0]);
        playlist.shift();
        queue.addTrack(playlist);

        return interaction.followUp({
            embeds: [embed],
        });
    } catch (error) {
        logger.error(error, "Error al intentar reproducir la playlist");
        return interaction.followUp("**[ ERROR ]** There was an error playing the playlist.");
    }
};

module.exports = play;