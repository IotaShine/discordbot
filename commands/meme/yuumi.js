const { SlashCommandBuilder } = require("discord.js");
const r34Helper = require("../../helpers/meme/r34_helper");

module.exports = {
    data: new SlashCommandBuilder().setName("yuumi").setDescription("ruleta de r34 de yuumi"),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            r34Helper("yuumi", 500)
                .then(img => {
                    interaction.followUp(img);
                })
                .catch(err => {
                    interaction.followUp(err);
                });
        } catch (error) {
            console.log(error);
            await interaction.followUp("Ocurrio un error");
        }
    },
};
