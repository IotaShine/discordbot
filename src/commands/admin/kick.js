const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
require("dotenv").config();
const { OWNERID } = process.env;
const { logger } = require("../../helpers");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("I kick the user you specify me.")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The target user to kick")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("You don't need one but it would be nice to have one."),
        ).setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers),

    /** Kicks a user
    * @param {import("discord.js").CommandInteraction} interaction
    */
    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason") || "No se especifico.";

        const owner = OWNERID ?? "-7";

        if (!interaction.member.permissions.has("KICK_MEMBERS") && interaction.user.id !== owner) {
            return await interaction.reply("**[ WARNING ]** You don't have the necessary permissions to use this command.");
        }

        if (user.id === interaction.user.id) {
            return await interaction.reply("**[ NOTICE ]** You can't kick yourself.");
        }

        if (user.id === interaction.client.user.id) {
            return await interaction.reply("**[ WARNING ]** Don't even think about it.");
        }

        if (user.id === owner) {
            return await interaction.reply("**[ WARNING ]** You can't kick the owner.");
        }

        if (!user.kickable) {
            return await interaction.reply("**[ WARNING ]** I can't kick this user.");
        }

        try {
            await user.kick(reason);
            return await interaction.reply(`**[ SUCCESS ]** ${user.tag} has been kicked.`);
        } catch (error) {
            logger.error(error, "Error in kick command");
            return await interaction.reply("**[ ERROR ]** Something went wrong in the process.");
        }
    },
};