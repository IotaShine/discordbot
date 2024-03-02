const { Events } = require("discord.js");
const { logger } = require("../helpers/");

module.exports = {
    name: Events.InteractionCreate,
    /** 
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            logger.error(`No command named [ ${interaction.commandName} ] was found`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            logger.error(error, "Error executing command");
            if (interaction.replied || interaction.deferred) {
                return await interaction.followUp({
                    content: "Hubo un error al ejecutar este comando",
                    ephemeral: true,
                });
            }
            await interaction.reply({
                content: "Hubo un error al ejecutar este comando",
                ephemeral: true,
            });

        }
    },
};
