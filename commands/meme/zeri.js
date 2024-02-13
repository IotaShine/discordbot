const { SlashCommandBuilder } = require("discord.js");
const r34Helper = require("../../helpers/meme/r34_helper");
module.exports = {
    data: new SlashCommandBuilder().setName("zeri").setDescription("ruleta de r34 de zeri"),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            r34Helper("zeri_(league_of_legends) ", 500)
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
