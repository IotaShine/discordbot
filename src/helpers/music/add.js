const { useMainPlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const logger = require("../config/logger");
const db = require("../config/database");

/** 
 * Adds a song to a playlist
 * @param {string} owner
 * @param {string} nombre
 * @param {string} cancion
 */
const addToPlaylist = async (owner, nombre, cancion) => {
    const playlistSqlQuery = "SELECT songs FROM playlists WHERE creator = ? AND nombre = ?";

    return new Promise((resolve, reject) => {
        db.get(playlistSqlQuery, [owner, nombre], (err, row) => {
            if (err) return reject(err);
            if (!row || row === undefined) return reject(new Error("**[ ERROR ]** Such playlist doesn't exist."));

            const songs = JSON.parse(row.songs);
            songs.push(cancion);

            const updateSqlQuery = "UPDATE playlists SET songs = ? WHERE creator = ? AND nombre = ?";
            db.run(updateSqlQuery, [JSON.stringify(songs), owner, nombre], err => {
                if (err) return reject(err);
                resolve();
            });
        });
    });
};

/** Handles the discord interaction of adding a song to a playlist
 * @param {import("discord.js").CommandInteraction} interaction
 */
const add = async (interaction) => {
    try {
        const player = useMainPlayer();

        const cancion = await interaction.options.getString("song");
        const playlist = await interaction.options.getString("playlist");
        const user_id = interaction.user.id;

        const songResult = await player.search(cancion);
        const track = songResult.tracks[0];

        if (!track) return await interaction.reply("**[ ERROR ]** The song couldn't be found. Maybe try with the URL.");

        const res = await addToPlaylist(user_id, playlist, track);
        if (res instanceof Error) throw res;

        const embed = new EmbedBuilder()
            .setTitle("**[ SUCCESS ]**")
            .setDescription(`${track.title}\nwas added to ${playlist}`)
            .setColor("Green");
        return await interaction.reply({ embeds: [embed], ephemeral: true });

    } catch (error) {
        logger.error(error, "Error in playlist add command");
        const embed = new EmbedBuilder().setTitle("Error").setDescription(error.message).setColor("Red");
        return await interaction.reply({ embeds: [embed] });
    }
};

module.exports = add;