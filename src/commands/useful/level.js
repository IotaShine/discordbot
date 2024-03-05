const { SlashCommandBuilder } = require("discord.js");
const { getUser, logger } = require("../../helpers");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("level")
        .setDescription("I tell you the level of the user.")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The target user")
                .setRequired(true),
        ),

    /**
     * @function
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction) {
        const userOption = interaction.options.getUser("user");
        if (userOption.id === interaction.client.user.id) {
            return interaction.reply(`**[ NOTICE ]** ${interaction.client.user}'s is **【MAX lvl】**`);
        }
        if (userOption.bot) return interaction.reply("Los bots no tienen nivel salamin");
        let rtnMsg = "";

        try {
            const user = await getUser(userOption.id);
            rtnMsg = (`**[ NOTICE ]** ${userOption.displayName} is **【${user.level} lvl】**`);
        } catch (error) {
            logger.error(error);
            rtnMsg = ("**[ ERROR ]** There was an error retrieving the user's level.");
        }

        return interaction.reply(rtnMsg);
    },
};