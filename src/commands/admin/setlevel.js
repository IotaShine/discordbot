const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { getUser, logger } = require("../../helpers");
const userCache = require("../../helpers/db/userCache");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setlevel")
        .setDescription("Set the level of a user.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("el usuario al que cambiarle el nivel.")
                .setRequired(true),
        )
        .addIntegerOption(option =>
            option.setName("level")
                .setDescription("el nivel al que cambiar")
                .setRequired(true),
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction) {
        const userId = interaction.options.getUser("user").id;
        const level = interaction.options.getInteger("level");
        const xp = Math.pow(level, 2) * 100;
        let user;
        try {
            user = await getUser(userId);
        } catch (error) {
            logger.error(error, "Error getting user from database in setLevel command.");
            return await interaction.reply("**[ ERROR ]** Something unexpected has happened.");
        }

        userCache.set(userId, { ...user, level, xp, isDirty: true });
        return await interaction.reply(`**[ NOTICE ]** User <@${userId}> level set to ${level} successfully.`);
    },
};