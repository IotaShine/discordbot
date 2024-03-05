const { EmbedBuilder } = require("discord.js");
const logger = require("../config/logger");
const db = require("../config/database");

/**
 * Deletes the playlist from the database
 * @param {string} owner
 * @param {string} nombre
 */
const deletePlaylist = async (owner, nombre) => {
    const playlistSqlQuery = "DELETE FROM playlists WHERE creator = ? AND nombre = ?";

    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(playlistSqlQuery, [owner, nombre], err => {
                if (err) {
                    reject(new Error(err.message));
                }
            });
        });

        resolve("**[ SUCCESS ]** Playlist removed");
    });
};

/**
 * Handles the discord interaction of removing a playlist
 * @param {import("discord.js").CommandInteraction} interaction
 */
const remove = async (interaction) => {
    const user_id = interaction.user.id;
    const nombre = interaction.options.getString("name");
    try {
        const a = await deletePlaylist(user_id, nombre);

        if (a instanceof Error) throw a;

        return await interaction.reply(a);
    } catch (error) {
        logger.error(error);
        const embed = new EmbedBuilder()
            .setTitle("**[ ERROR ]**")
            .setDescription("Something bad happened and I wasn't able to remove the playlist.")
            .setColor("Red");
        return await interaction.reply({ embeds: [embed] });
    }
};

module.exports = remove;