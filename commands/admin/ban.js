const { SlashCommandBuilder } = require("discord.js");
require("dotenv").config();
const { OWNERID } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Banea a un usuario.")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("El usuario que queres banear.")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("La razón por la que queres banear al usuario."),
        ),

    /** Bans a user
    * @param {CommandInteraction} interaction
    */
    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason") || "Sin razón.";

        if (!interaction.member.permissions.has("BAN_MEMBERS") && interaction.user.id !== OWNERID) {
            return await interaction.reply("No tenes permisos para banear usuarios.");
        }

        if (user.id === interaction.user.id) {
            return await interaction.reply("No te podes banear a vos mismo.");
        }

        if (user.id === interaction.client.user.id) {
            return await interaction.reply("No me podes banear a mi.");
        }

        if (user.id === OWNERID) {
            return await interaction.reply("No te hagas el piola, no podes banear al dueño del bot.");
        }

        if (!user.bannable) {
            return await interaction.reply("No puedo banear a este usuario.");
        }

        try {
            await user.ban({ reason });
            return await interaction.reply(`Baneado a ${user.tag} por ${reason}`);
        } catch (error) {
            console.log(error);
            return await interaction.reply("Ocurrió un error");
        }
    },
};