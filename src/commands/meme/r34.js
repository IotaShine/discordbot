const { SlashCommandBuilder } = require("discord.js");
const { logger, r34Helper } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder().setName("r34")
        .setDescription("ruleta de r34 del personaje deseado")
        .addStringOption(option => option
            .setName("personaje")
            .setDescription("Nombre del personaje")
            .setRequired(true),
        )
        .setNSFW(true),

    /** Sends a random image from r34 api
    * @param {import("discord.js").CommandInteraction} interaction
    */
    async execute(interaction) {
        if (!interaction.channel.nsfw) return await interaction.reply("Este comando solo puede ser usado en canales NSFW");
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
