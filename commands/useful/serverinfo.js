const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { logger } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("te tiro la data sobre el server este"),

    /** Sends the server info
    * @param {import("discord.js").Interaction} interaction
    */
    async execute(interaction) {

        const { guild } = interaction;
        try {
            const { name, id, memberCount, createdAt, premiumTier, premiumSubscriptionCount, verificationLevel, channels, roles } = guild;
            const ownerUser = await guild.fetchOwner();
            const textChannels = channels.cache.filter(c => c.type === 0).size;
            const voiceChannels = channels.cache.filter(c => c.type === 2).size;
            const roleCount = roles.cache.size;

            const embed = new EmbedBuilder()
                .setTitle(`${name}'s Information`)
                .addFields(
                    { name: "Nombre del server", value: name },
                    { name: "Server ID", value: String(id) },
                    { name: "Cantidad de miembros", value: String(memberCount) },
                    { name: "Fecha de Creación", value: String(createdAt.toDateString()) },
                    { name: "Server Owner", value: ownerUser.user.tag },
                    { name: "Nivel de Boost", value: String(premiumTier) },
                    { name: "Cantidad de Boosts", value: String(premiumSubscriptionCount) },
                    { name: "Verification Level", value: String(verificationLevel) },
                    { name: "Cantidad de Canales de Texto", value: String(textChannels) },
                    { name: "Cantidad de Canales de Voz", value: String(voiceChannels) },
                    { name: "Cantidad de roles", value: String(roleCount) },
                )
                .setColor("Random");

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            logger.error(error, "Error in serverinfo command");
            await interaction.reply("Salio para el orto esto no se que onda hubo un error");
        }
    },
};
