const { SlashCommandBuilder } = require("discord.js");
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
        let rtnMsg = "";

        try {
            const user = await getUser(userOption.id);
            rtnMsg = (`El nivel de **${userOption.displayName}** es **${user.level}** master`);
        } catch (error) {
            logger.error(error);
            rtnMsg = ("Ocurrió un error al buscar el nivel del usuario");
        }

        return interaction.reply(rtnMsg);
    },
};