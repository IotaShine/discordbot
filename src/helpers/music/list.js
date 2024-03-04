const { EmbedBuilder } = require("discord.js");
const logger = require("../config/logger");

/** 
 * Requests the playlists from the database
 * @param {import("discord.js").Client} client
 * @param {string} user_id
 */
const requestPlaylists = async (client, user_id) => {
    const db = client.db;
    const sql = "SELECT * FROM playlists WHERE creator = ? ORDER BY playlist_id";

    return new Promise((resolve, reject) => {
        db.all(sql, [user_id], (err, rows) => {
            if (err) reject(err);

            resolve(rows);
        });
    });
};

/**
 * Handles the discord interaction of listing the playlists
 * @param {import("discord.js").CommandInteraction} interaction
 */
const list = async (interaction) => {
    await interaction.deferReply();
    try {
        const { client } = interaction;
        const user_id = interaction.user.id;
        const data = await requestPlaylists(client, user_id);

        if (!data.length) {
            return await interaction.followUp("No hay playlists guardadas");
        }

        const msj = await data
            .map((playlist, i) => {
                const { nombre } = playlist;
                return `${i + 1}. ${nombre}`;
            })
            .join("\n");

        const image = await interaction.client.user.avatarURL({
            extension: "png",
            size: 128,
        });

        return await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Playlists")
                    .setColor("Random")
                    .setDescription(msj)
                    .setFooter({ text: `Cantidad: ${data.length}` })
                    .setThumbnail(image),
            ],
        });
    } catch (error) {
        logger.error(error, "Error when listing playlists");
        return await interaction.followUp(error);
    }
};

module.exports = list;