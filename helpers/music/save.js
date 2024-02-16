const { EmbedBuilder } = require("discord.js");

const createPlaylist = async (client, tracks, owner, nombre) => {
    const db = client.db;
    const userSqlQuery = "INSERT INTO users (user_id) VALUES(?) ON CONFLICT(user_id) DO NOTHING";
    const playlistSqlQuery = "INSERT INTO playlists (creator, nombre, songs) VALUES(?, ?, ?)";

    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(userSqlQuery, [owner], err => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                }
            });

            db.run(playlistSqlQuery, [owner, nombre, JSON.stringify(tracks)], err => {
                if (err) {
                    if (err.code === "SQLITE_CONSTRAINT") {
                        reject(new Error("Ya tienes una playlist con ese nombre"));
                    }
                    reject(new Error(err.message));
                }
            });
        });

        resolve("Playlist creada");
    });

};

const save = async (interaction, guild) => {
    if (!interaction.member.voice.channel) {
        return await interaction.reply("No estas en un canal de voz salame");
    }

    try {
        const queue = await interaction.client.player.nodes.get(guild);
        if (!queue) await interaction.reply("No hay nada sonando master");
        await interaction.deferReply({ ephemeral: true });
        const nombre = await interaction.options.getString("nombre");

        const { currentTrack } = queue;
        const tracks = [currentTrack, ...queue.tracks.data];

        const canciones = tracks
            .slice(0, 10)
            .map(song => {
                return song.raw.title;
            })
            .join("\n");

        const { client } = interaction;
        const user_id = interaction.user.id;
        const a = await createPlaylist(client, tracks, user_id, nombre);

        if (a instanceof Error) throw a;

        return await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Playlist ${nombre} creada`)
                    .setDescription(`**[${canciones}]**`)
                    .setColor("Random")
                    .setFooter({
                        text: "Solo aparecen las primeras 10 canciones",
                    }),
            ],
        });
    } catch (error) {
        console.log(error);
        const embed = new EmbedBuilder().setTitle("Error").setDescription(error.message).setColor("Red");
        return await interaction.followUp({ embeds: [embed] });
    }
};

module.exports = save;