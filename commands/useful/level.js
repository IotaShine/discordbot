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
        const user = interaction.options.getUser("user");
        if (user.bot) return interaction.reply("Los bots no tienen nivel salamin");

        const cachedUser = userCache.get(user.id);

        if (!cachedUser) {
            try {
                const newUser = await getUser(user.id);
                if (!newUser) return interaction.reply("No se encontró al usuario");
                userCache.set(user.id, newUser);
                return await interaction.reply(`El nivel de ${user.username} es ${newUser.level} master`);
            } catch (error) {
                logger.error(error);
                return interaction.reply("There was an error while fetching the data");
            }
        } else {
            return interaction.reply(`El nivel de ${user.username} es ${user.level} master`);
        }
    },
};