const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Track } = require("discord-player");
const { createPlaylist, requestPlaylists, requestTracks } = require("../../helpers/pl");

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
        const command = await interaction.options.getSubcommand();
        const guild = await interaction.guild.id;

        switch (command) {
        case "play":
            play(interaction, guild);
            break;
        case "save":
            save(interaction, guild);
            break;
        case "list":
            list(interaction);
            break;

        default:
            interaction.followUp("No se que hacer");
            break;
        }
    },
};

const play = async (interaction, guild) => {
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
        const request = await requestTracks(guild, nombre);

        console.log(request);
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
                        return `${i + 1}. [${song.raw.title}](${song.url}) - [${song.duration}]`;
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
};

const save = async (interaction, guild) => {
    if (!interaction.member.voice.channel) {
        return await interaction.reply("No estas en un canal de voz salame");
    }

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

        const { client } = interaction;
        const a = await createPlaylist(client, tracks, guild, nombre);
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
        return await interaction.followUp("Ocurrio un error");
    }
};

const list = async interaction => {
    await interaction.deferReply();
    try {
        const data = await requestPlaylists(await interaction.guild.id);

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
        return await interaction.followUp(error);
    }
};
