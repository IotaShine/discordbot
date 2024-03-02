const { SlashCommandBuilder } = require("discord.js");
const userCache = require("../../helpers/db/userCache");
const { getUser, logger } = require("../../helpers");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("level")
        .setDescription("te tiro la data de que nivel sos"),

    /**
     * @function
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction) {
        const user = userCache.get(interaction.user.id);

        if (!user) {
            try {
                const newUser = await getUser(interaction.user.id);
                userCache.set(interaction.user.id, newUser);
                return await interaction.reply(`Sos nivel ${newUser.level} master`);
            } catch (error) {
                logger.error(error);
                return interaction.reply("There was an error while fetching your data");
            }
        } else {
            interaction.reply(`Sos nivel ${user.level} master`);
        }
    },
};