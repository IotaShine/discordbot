const { SlashCommandBuilder } = require("discord.js");
require("dotenv").config();
const { OWNERID } = process.env;
const { logger } = require("../../helpers");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Expulsa a un usuario.")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("El usuario que queres expulsar.")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("La razón por la que queres expulsar al usuario."),
        ),

    /** Kicks a user
    * @param {import("discord.js").CommandInteraction} interaction
    */
    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason") || "No se especifico.";

        const owner = OWNERID ?? "-7";

        if (!interaction.member.permissions.has("KICK_MEMBERS") && interaction.user.id !== owner) {
            return await interaction.reply("No tenes permisos para expulsar usuarios.");
        }

        if (user.id === interaction.user.id) {
            return await interaction.reply("No te podes expulsar a vos mismo.");
        }

        if (user.id === interaction.client.user.id) {
            return await interaction.reply("No me podes expulsar a mi.");
        }

        if (user.id === owner) {
            return await interaction.reply("No te hagas el piola, no podes expulsar al dueño del bot.");
        }

        if (!user.kickable) {
            return await interaction.reply("No puedo expulsar a este usuario.");
        }

        try {
            await user.kick(reason);
            return await interaction.reply(`Expulsado a ${user.tag} por ${reason}`);
        } catch (error) {
            logger.error(error, "Error in kick command");
            return await interaction.reply("Ocurrió un error");
        }
    },
};