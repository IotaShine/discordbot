const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const logger = require("../config/logger");
const db = require("../config/database");

/**
 * Creates a playlist in the database
 * @param {import("discord-player").Track[]} tracks
 * @param {string} owner
 * @param {string} nombre
 */
const createPlaylist = async (tracks, owner, nombre) => {
    const userSqlQuery = "INSERT INTO users (user_id) VALUES(?) ON CONFLICT(user_id) DO NOTHING";
    const playlistSqlQuery = "INSERT INTO playlists (creator, nombre, songs) VALUES(?, ?, ?)";

    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(userSqlQuery, [owner], err => {
                if (err) {
                    logger.error(err.message);
                    reject(err);
                }
            });

            db.run(playlistSqlQuery, [owner, nombre, JSON.stringify(tracks)], err => {
                if (err) {
                    if (err.code === "SQLITE_CONSTRAINT") {
                        reject(err.code);
                    }
                    reject();
                }
            });
        });

        resolve();
    });

};

/**
 * Handles the discord interaction of saving the current queue
 * @param {import("discord.js").CommandInteraction} interaction
 */
const save = async (interaction) => {
    if (!interaction.member.voice.channel) {
        return await interaction.reply("**[ NOTICE ]** You need to be in a voice channel.");
    }
    const guild = interaction.guild.id;

    try {
        const queue = useQueue(guild);
        if (!queue) return await interaction.reply("**[ NOTICE ]** There's nothing playing.", { ephemeral: true });

        await interaction.deferReply({ ephemeral: true });
        const nombre = await interaction.options.getString("name");

        const { currentTrack } = queue;
        const tracks = [currentTrack, ...queue.tracks.data];

        const canciones = tracks
            .slice(0, 10)
            .map(song => {
                return song.raw.title;
            })
            .join("\n");

        const user_id = interaction.user.id;
        const a = await createPlaylist(tracks, user_id, nombre);

        if (a instanceof Error) throw a;

        return await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Playlist **【${nombre}】** created`)
                    .setDescription(`**[${canciones}]**`)
                    .setColor("Random")
                    .setFooter({
                        text: "Solo aparecen las primeras 10 canciones",
                    }),
            ],
        });
    } catch (error) {
        logger.error(error);
        const embed = new EmbedBuilder()
            .setTitle("**[ ERROR ]**")
            .setDescription("**[ ERROR ]** There was an error saving the playlist.")
            .setColor("Red");

        if (error === "SQLITE_CONSTRAINT") {
            embed.setDescription("**[ ERROR ]** There's already a playlist with that name.");
        }

        return await interaction.followUp({ embeds: [embed] });
    }
};

module.exports = save;