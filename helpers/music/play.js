const { EmbedBuilder } = require("discord.js");
const { Track } = require("discord-player");

const playlistPlay = async (client, user_id, nombre) => {
    const db = client.db;
    const sql = "SELECT * FROM playlists WHERE creator = ? AND nombre = ?";

    return new Promise((resolve, reject) => {
        db.all(sql, [user_id, nombre], (err, rows) => {
            if (err) reject(err);

            resolve(rows);
        });
    });
};

const play = async (interaction) => {
    if (!interaction.member.voice.channel) {
        return await interaction.reply("No estas en un canal de voz salame");
    }

    const { player } = interaction.client;

    const queue = await player.queues.create(interaction.guild);

    if (!queue.connection) {
        await queue.connect(interaction.member.voice.channel);
    }

    await interaction.deferReply();

    try {
        const nombre = await interaction.options.getString("playlist");
        const { client } = interaction;
        const user_id = interaction.user.id;
        const request = await playlistPlay(client, user_id, nombre);

        if (!request) {
            return await interaction.followUp("No existe una playlist con ese nombre");
        }

        const temas = await JSON.parse(request[0].songs);
        const playlist = await temas.map(song => new Track(player, { ...song }));

        const embed = new EmbedBuilder()
            .setTitle(`Dándole a play a ${nombre}`)
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
            .setFooter({ text: "Solo se muestran las primeras 10 canciones" });

        await queue.play(playlist[0]);
        playlist.shift();
        await queue.addTrack(playlist);

        return interaction.followUp({
            embeds: [embed],
        });
    } catch (error) {
        return interaction.followUp(
            `Ando mal de la panza y hubo un error :nauseated_face: :\n\`\`\`${error}\`\`\``,
        );
    }
};

module.exports = play;