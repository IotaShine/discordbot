const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
require("dotenv").config();
const { OWNERID } = process.env;
const { logger } = require("../../helpers");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("I ban the user you specify me.")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The target user to ban.")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("You don't need one but it would be nice to have one."),
        ).setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),

    /** Bans a user
    * @param {import("discord.js").CommandInteraction} interaction
    */
    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason") || "The gods decided it.";

        const owner = OWNERID ?? "-7";

        if (!interaction.member.permissions.has("BAN_MEMBERS") && interaction.user.id !== owner) {
            return await interaction.reply("**[ WARNING ]** You don't have the necessary permissions to use this command.");
        }

        if (user.id === interaction.user.id) {
            return await interaction.reply("**[ NOTICE ]** You can't ban yourself.");
        }

        if (user.id === interaction.client.user.id) {
            return await interaction.reply("**[ WARNING ]** Don't even think about it.");
        }

        if (user.id === owner) {
            return await interaction.reply("**[ WARNING ]** You can't ban the owner.");
        }

        if (!user.bannable) {
            return await interaction.reply("**[ WARNING ]** I can't ban this user.");
        }

        try {
            await user.ban({ reason });
            return await interaction.reply(`**[ SUCCESS ]** ${user.tag} has been banned.`);
        } catch (error) {
            logger.error(error, "Error in ban command");
            return await interaction.reply("**[ ERROR ]** Something went wrong in the process.");
        }
    },
};