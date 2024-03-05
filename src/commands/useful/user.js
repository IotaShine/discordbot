const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { logger } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("I inspect a user for you.")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user you want info in.")
                .setRequired(true),
        ),

    /** Sends the user info
    * @param {import("discord.js").CommandInteraction} interaction
    */
    async execute(interaction) {
        const member = interaction.options.getMember("user");
        const color = interaction.options.getUser("user").accentColor || "Random";

        if (!member) {
            return interaction.reply({ content: "**[ NOTICE ]** You didn't mention a user", ephemeral: true });
        }

        const userRoles = member.roles.cache
            .filter(r => r.id !== interaction.guild.id)
            .map(r => `<@&${r.id}>`)
            .join(", ") || "None";

        const embed = new EmbedBuilder()
            .setTitle(`${member.user.tag}'s Information`)
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                { name: "**[ USERNAME ]**", value: member.user.username, inline: true },
                { name: "**[ USER ID ]**", value: member.user.id, inline: true },
                { name: "**[ BOT ]**", value: member.user.bot ? "Si" : "No", inline: true },
                { name: "**[ CREATION DATE ]**", value: member.user.createdAt.toDateString(), inline: true },
                { name: "**[ SERVER JOIN DATE ]**", value: member.joinedAt.toDateString(), inline: true },
                { name: "**[ ROLES ]**", value: userRoles, inline: false },
            )
            .setColor(color);


        try {
            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            logger.error(error, "Error in user command");
            await interaction.reply("**[ ERROR ]** There was an error getting the user info.");
        }
    },
};
