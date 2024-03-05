const { Events } = require("discord.js");
const { logger } = require("../helpers/");

module.exports = {
    name: Events.InteractionCreate,
    /** 
     * @param {import("discord.js").CommandInteraction} interaction 
     */
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        if (!interaction.guild) return interaction.reply("Nope");

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
                    content: "[ ERROR ] There was an error executing this command.",
                    ephemeral: true,
                });
            }
            await interaction.reply({
                content: "**[ ERROR ]** There was an error executing this command.",
                ephemeral: true,
            });

        }
    },
};
