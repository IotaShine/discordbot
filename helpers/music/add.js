const { EmbedBuilder } = require("discord.js");

/** 
 * Adds a song to a playlist
 * @param {Client} client
 * @param {string} owner
 * @param {string} nombre
 * @param {string} cancion
 */
const addToPlaylist = async (client, owner, nombre, cancion) => {
    const db = client.db;
    const playlistSqlQuery = "SELECT songs FROM playlists WHERE creator = ? AND nombre = ?";

    return new Promise((resolve, reject) => {
        db.get(playlistSqlQuery, [owner, nombre], (err, row) => {
            if (err) return reject(err);
            if (!row || row === undefined) return reject(new Error("No tienes una playlist con ese nombre"));

            const songs = JSON.parse(row.songs);
            songs.push(cancion);

            const updateSqlQuery = "UPDATE playlists SET songs = ? WHERE creator = ? AND nombre = ?";
            db.run(updateSqlQuery, [JSON.stringify(songs), owner, nombre], err => {
                if (err) return reject(err);
                resolve("Canción agregada");
            });
        });
    });
};

/** Handles the discord interaction of adding a song to a playlist
 * @param {CommandInteraction} interaction
 */
const add = async (interaction) => {
    try {
        const { client } = interaction;
        const { player } = client;

        const cancion = await interaction.options.getString("cancion");
        const playlist = await interaction.options.getString("playlist");
        const user_id = interaction.user.id;

        const songResult = await player.search(cancion);
        const track = await songResult.tracks[0];

        if (!track) return await interaction.reply("No se encontró la canción");

        const res = await addToPlaylist(client, user_id, playlist, track);
        if (res instanceof Error) throw res;

        const embed = new EmbedBuilder()
            .setTitle(res)
            .setDescription(`Cancion ${track.title} agregada a la playlist ${playlist}`)
            .setColor("Green");

        return await interaction.reply({ embeds: [embed], ephemeral: true });

    } catch (error) {
        console.log(error);
        const embed = new EmbedBuilder().setTitle("Error").setDescription(error.message).setColor("Red");
        return await interaction.reply({ embeds: [embed] });
    }
};

module.exports = add;