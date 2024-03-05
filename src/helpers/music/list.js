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
            return await interaction.followUp("**[ NOTICE ]** You don't have any saved playlists.");
        }

        const msj = await data
            .map((playlist, i) => {
                const { nombre } = playlist;
                return `${i + 1}. ${nombre}`;
            })
            .join("\n");

        const image = interaction.user.avatarURL({ extension: "png", size: 512 });

        return await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle("**[ PLAYLISTS ]**")
                    .setColor("Random")
                    .setDescription(msj)
                    .setFooter({ text: `Amount: ${data.length}` })
                    .setThumbnail(image),
            ],
        });
    } catch (error) {
        logger.error(error, "Error when listing playlists");
        return await interaction.followUp("**[ ERROR ]** There was an error listing the playlists.");
    }
};

module.exports = list;