const { SlashCommandBuilder } = require("discord.js");
const { add, play, remove, list, save } = require("../../helpers");

// TODO - Cambiar como se guardan las playlists https://discord-player.js.org/guide/faq/serialization-and-deserialization
module.exports = {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("I handle the playlists.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("play")
                .setDescription("I add the songs from a playlist to the queue.")
                .addStringOption(option =>
                    option
                        .setName("playlist")
                        .setDescription("playlist name")
                        .setRequired(true),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("save")
                .setDescription("I save the current queue as a playlist.")
                .addStringOption(option =>
                    option
                        .setName("name")
                        .setDescription("playlist name")
                        .setRequired(true),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("I list your saved playlists."),
        ).addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("I remove a playlist from your saved playlists.")
                .addStringOption(option =>
                    option
                        .setName("name")
                        .setDescription("playlist name")
                        .setRequired(true),
                ),
        ).addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("I add a song to an existing playlist.")
                .addStringOption(option =>
                    option
                        .setName("song")
                        .setDescription("name or url of the song")
                        .setRequired(true),
                )
                .addStringOption(option =>
                    option
                        .setName("playlist")
                        .setDescription("name of the playlist")
                        .setRequired(true),
                ),
        ),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction) {
        const command = await interaction.options.getSubcommand();

        switch (command) {
            case "play":
                play(interaction);
                break;
            case "save":
                save(interaction);
                break;
            case "list":
                list(interaction);
                break;
            case "remove":
                remove(interaction);
                break;
            case "add":
                add(interaction);
                break;

            default:
                interaction.followUp("**[ ERROR ]** There was an error with the playlist command.");
                break;
        }
    },
};
