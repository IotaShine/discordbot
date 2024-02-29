const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const logger = require("../../helpers/config/logger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("te tiro la data sobre el server este"),

    /** Sends the server info
    * @param {CommandInteraction} interaction
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
                    { name: "Server Name", value: name },
                    { name: "Server ID", value: String(id) },
                    { name: "Member Count", value: String(memberCount) },
                    { name: "Creation Date", value: String(createdAt.toDateString()) },
                    { name: "Server Owner", value: ownerUser.user.tag },
                    { name: "Boost Level", value: String(premiumTier) },
                    { name: "Boost Count", value: String(premiumSubscriptionCount) },
                    { name: "Verification Level", value: String(verificationLevel) },
                    { name: "Text Channels", value: String(textChannels) },
                    { name: "Voice Channels", value: String(voiceChannels) },
                    { name: "Total Roles", value: String(roleCount) },
                )
                .setColor("Random");

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            logger.error(error, "Error in serverinfo command");
            await interaction.reply("Salio para el orto esto no se que onda hubo un error");
        }
    },
};
