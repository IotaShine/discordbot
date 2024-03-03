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
        let rtnMsg = "";

        if (!user) {
            try {
                user = await getUser(userOption.id);
                if (!user) {
                    userCache.set(userOption.id, { user_id: userOption.id, xp: 0, level: 0, isDirty: true });
                    rtnMsg = (`El nivel de **${userOption.displayName}** es **0** master`);
                }
                userCache.set(userOption.id, user);
                rtnMsg = (`El nivel de **${userOption.displayName}** es **${user.level}** master`);
            } catch (error) {
                logger.error(error);
                rtnMsg = ("Ocurrió un error al buscar el nivel del usuario");
            }
        } else {
            rtnMsg = (`El nivel de ${userOption.username} es ${userOption.level} master`);
        }

        return interaction.reply(rtnMsg);
    },
};