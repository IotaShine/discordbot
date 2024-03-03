const { SlashCommandBuilder } = require("discord.js");
const userCache = require("../../helpers/db/userCache");
const { getUser, logger } = require("../../helpers");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("level")
        .setDescription("te tiro la data de que nivel sos")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("El usuario del que queres saber el nivel")
                .setRequired(true),
        ),

    /**
     * @function
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction) {
        const userOption = interaction.options.getUser("user");
        if (userOption.bot) return interaction.reply("Los bots no tienen nivel salamin");

        let user = userCache.get(userOption.id);

        if (!user) {
            try {
                user = await getUser(userOption.id);
                if (!user) {
                    userCache.set(userOption.id, { user_id: userOption.id, xp: 0, level: 0, isDirty: true });
                    return await interaction.reply(`El nivel de **${userOption.displayName}** es **0** master`);
                }
                userCache.set(userOption.id, user);
                return await interaction.reply(`El nivel de **${userOption.displayName}** es **${user.level}** master`);
            } catch (error) {
                logger.error(error);
                return interaction.reply("There was an error while fetching the data");
            }
        } else {
            return interaction.reply(`El nivel de ${userOption.username} es ${userOption.level} master`);
        }
    },
};