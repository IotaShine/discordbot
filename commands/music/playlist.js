const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Track } = require("discord-player");
const { playlistCreate, listPlaylist, playlistPlay } = require("../../helpers/pl");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("guardo, listo o le doy play a una playlist")
        .addSubcommand(subcommand =>
            subcommand
                .setName("play")
                .setDescription("le doy play a una playlist que se haya guardado")
                .addStringOption(option =>
                    option
                        .setName("playlist")
                        .setDescription("nombre de la playlist")
                        .setRequired(true),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("save")
                .setDescription("guardo la queue que esta sonando actualmente como playlist")
                .addStringOption(option =>
                    option
                        .setName("nombre")
                        .setDescription("nombre de la playlist")
                        .setRequired(true),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("muestro las playlist que estan disponibles para este servidor"),
        ),
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            return await interaction.reply("No estas en un canal de voz salame");
        }

        const command = await interaction.options.getSubcommand();
        const guild = await interaction.guild.id;

        if (command === "play") {
            const { player } = interaction.client;

            const queue = await player.queues.create(interaction.guild);

            if (!queue.connection) {
                await queue.connect(interaction.member.voice.channel);
            }

            await interaction.deferReply();

            try {
                const nombre = await interaction.options.getString("playlist");
                const request = await playlistPlay(guild, nombre);

                if (!request) {
                    return await interaction.followUp("No existe una playlist con ese nombre");
                }

                const temas = await request.map(cancion => {
                    return new Track(player, { ...cancion });
                });

                const embed = new EmbedBuilder()
                    .setTitle(`Dandole a play a ${nombre}`)
                    .setColor("Random")
                    .setThumbnail(temas[0].thumbnail)
                    .setDescription(
                        temas
                            .slice(0, 10)
                            .map((song, i) => {
                                return `${i + 1}. [${song.raw.title}](${song.url}) - [${
                                    song.duration
                                }]`;
                            })
                            .join("\n"),
                    )
                    .setFooter({ text: "Solo se muestran las primeras 10 canciones" });

                await queue.play(temas[0]);
                temas.shift();
                await queue.addTrack(temas);

                return interaction.followUp({
                    embeds: [embed],
                });
            } catch (error) {
                return interaction.followUp(
                    `Ando mal de la panza y hubo un error :nauseated_face: :\n\`\`\`${error}\`\`\``,
                );
            }
        }

        if (command === "save") {
            try {
                const queue = await interaction.client.player.nodes.get(guild);
                if (!queue) await interaction.reply("No hay nada sonando master");
                await interaction.deferReply();
                const nombre = await interaction.options.getString("nombre");

                const { currentTrack } = queue;
                const tracks = [currentTrack, ...queue.tracks.data];

                const canciones = tracks
                    .slice(0, 10)
                    .map(song => {
                        return song.raw.title;
                    })
                    .join("\n");
                await playlistCreate(tracks, guild, nombre);
                return await interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Playlist ${nombre} creada`)
                            .setDescription(`**[${canciones}]**`)
                            .setColor("Random")
                            .setFooter({ text: "Solo aparecen las primeras 10 canciones" }),
                    ],
                });
            } catch (error) {
                console.log(error);
                return await interaction.followUp("Ocurrio un error");
            }
        }
        if (command === "list") {
            await interaction.deferReply();
            try {
                const data = await listPlaylist(await interaction.guild.id);

                const msj = await data
                    .map((playlist, i) => {
                        return `${i + 1}. ${playlist}`;
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
                return await interaction.followUp(error);
            }
        }
    },
};
