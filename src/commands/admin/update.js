const { SlashCommandBuilder } = require("discord.js");
const updateGuildCommands = require("../../../scripts/deploy-commands");
const updateGlobalCommands = require("../../../scripts/deploy-commands-global");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("update")
        .setDescription("Update the bot's commands")
        .addSubcommand(subcommand =>
            subcommand
                .setName("guild")
                .setDescription("Update the guild's commands"),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("global")
                .setDescription("Update the global commands"),
        ),
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const ownerId = process.env.OWNERID;
        if (!ownerId) return interaction.reply("No se quien es el dueño del bot, no voy a ejecutar ese comando.");

        const userId = interaction.user.id;

        if (userId !== ownerId) return interaction.reply("No tienes permisos para ejecutar este comando.");

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "guild") {
            updateGuildCommands();
            interaction.reply("Comandos de este servidor actualizados.");
        } else if (subcommand === "global") {
            updateGlobalCommands();
            interaction.reply("Comandos globales actualizados.");
        }
    },
};