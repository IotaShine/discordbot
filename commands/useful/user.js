const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { logger } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Mencioname a uno y te tiro la data")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("El usuario del que queres la data.")
                .setRequired(true),
        ),

    /** Sends the user info
    * @param {import("discord.js").Interaction} interaction
    */
    async execute(interaction) {
        const member = interaction.options.getMember("user");

        if (!member) {
            return interaction.reply({ content: "You did not mention a user!", ephemeral: true });
        }

        const userRoles = member.roles.cache
            .filter(r => r.id !== interaction.guild.id)
            .map(r => `<@&${r.id}>`)
            .join(", ") || "None";

        const embed = new EmbedBuilder()
            .setTitle(`${member.user.tag}'s Information`)
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                { name: "Username", value: member.user.username, inline: true },
                { name: "User ID", value: member.user.id, inline: true },
                { name: "Bot", value: member.user.bot ? "Si" : "No", inline: true },
                { name: "Fecha de Creación", value: member.user.createdAt.toDateString(), inline: true },
                { name: "Fecha de union al servidor", value: member.joinedAt.toDateString(), inline: true },
                { name: "Roles", value: userRoles, inline: false },
            )
            .setColor("Random");


        try {
            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            logger.error(error, "Error in user command");
            await interaction.reply("Salio para el orto esto no se que onda hubo un error");
        }
    },
};
