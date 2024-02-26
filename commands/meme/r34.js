const { SlashCommandBuilder } = require("discord.js");
const r34Helper = require("../../helpers/meme/r34_helper");
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
            r34Helper(`${character} `, 500)
                .then(img => {
                    interaction.followUp(img);
                })
                .catch(err => {
                    interaction.followUp(err);
                });
        } catch (error) {
            console.log(error);
            await interaction.followUp("Ocurrió un error");
        }
    },
};
