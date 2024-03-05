const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { logger } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("I inspect the server for you."),

    /** Sends the server info
    * @param {import("discord.js").CommandInteraction} interaction
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
                    { name: "[ SERVER NAME ]", value: name },
                    { name: "[ SERVER ID ]", value: String(id) },
                    { name: "[ MEMBER COUNT ]", value: String(memberCount) },
                    { name: "[ CREATION DATE ]", value: String(createdAt.toDateString()) },
                    { name: "[ SERVER OWNER ]", value: ownerUser.user.tag },
                    { name: "[ BOOST LEVEL ]", value: String(premiumTier) },
                    { name: "[ BOOST AMOUNT ]", value: String(premiumSubscriptionCount) },
                    { name: "[ VERIFICATION LEVEL ]", value: String(verificationLevel) },
                    { name: "[ TEXT CHANNELS AMOUNT ]", value: String(textChannels) },
                    { name: "[ VOICE CHANNELS AMOUNT ]", value: String(voiceChannels) },
                    { name: "[ ROLE AMOUNT ]", value: String(roleCount) },
                )
                .setColor("Random");

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            logger.error(error, "Error in serverinfo command");
            await interaction.reply("**[ ERROR ]** There was an error getting the server info.");
        }
    },
};
