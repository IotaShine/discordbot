const { SlashCommandBuilder } = require("discord.js");
const r34Helper = require("../../helpers/meme/r34_helper");
const logger = require("../../helpers/config/logger");

module.exports = {
    data: new SlashCommandBuilder().setName("r34")
        .setDescription("ruleta de r34 del personaje deseado")
        .addStringOption(option => option
            .setName("personaje")
            .setDescription("Nombre del personaje")
            .setRequired(true),
        ),

    /** Sends a random image from r34 api
    * @param {CommandInteraction} interaction
    */
    async execute(interaction) {
        await interaction.deferReply();
        const character = interaction.options.getString("personaje");
        try {
            const img = await r34Helper(`${character} `);
            return interaction.followUp(
                { content: `Imagen aleatoria de ${character}`, files: [img] },
            );
        } catch (error) {
            logger.error(error, "Error in r34 command");
            await interaction.followUp("Ocurrió un error");
        }
    },
};
