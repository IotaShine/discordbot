const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const updateGuildCommands = require("../../../scripts/deploy-commands");
const updateGlobalCommands = require("../../../scripts/deploy-commands-global");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("update")
        .setDescription("Update my commands.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("guild")
                .setDescription("Only for the dev server. Update the guild commands."),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("global")
                .setDescription("Update the global commands."),
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const ownerId = process.env.OWNERID;
        if (!ownerId) return interaction.reply("**[ ERROR ]** I can't seem to find my owner.");

        const userId = interaction.user.id;

        if (userId !== ownerId) return interaction.reply("**[ ERROR ]** You're not my owner.");
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "guild") {
            updateGuildCommands();
            interaction.reply("**[ NOTICE ]** Server commands updated.");
        } else if (subcommand === "global") {
            updateGlobalCommands();
            interaction.reply("**[ NOTICE ]** Global commands updated.");
        }
    },
};