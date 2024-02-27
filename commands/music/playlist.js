const { SlashCommandBuilder } = require("discord.js");
const play = require("../../helpers/music/play");
const save = require("../../helpers/music/save");
const list = require("../../helpers/music/list");
const remove = require("../../helpers/music/remove");
const add = require("../../helpers/music/add");

// TODO - Cambiar como se guardan las playlists https://discord-player.js.org/guide/faq/serialization-and-deserialization
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
                .setDescription("muestro las playlist que están disponibles para este servidor"),
        ).addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("elimino una playlist que haya guardado")
                .addStringOption(option =>
                    option
                        .setName("nombre")
                        .setDescription("nombre de la playlist")
                        .setRequired(true),
                ),
        ).addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("agrego una canción a una playlist")
                .addStringOption(option =>
                    option
                        .setName("cancion")
                        .setDescription("nombre o url de la canción")
                        .setRequired(true),
                )
                .addStringOption(option =>
                    option
                        .setName("playlist")
                        .setDescription("nombre de la playlist")
                        .setRequired(true),
                ),
        ),

    /**
     * @param {CommandInteraction} interaction
     */
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
                list(interaction, guild);
                break;
            case "remove":
                remove(interaction);
                break;
            case "add":
                add(interaction);
                break;

            default:
                interaction.followUp("No se que hacer");
                break;
        }
    },
};
