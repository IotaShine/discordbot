const { SlashCommandBuilder } = require("discord.js");
const play = require("../../helpers/music/play");
const save = require("../../helpers/music/save");
const list = require("../../helpers/music/list");

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
                list(interaction, guild);
                break;
            default:
                interaction.followUp("No se que hacer");
                break;
        }
    },
};
