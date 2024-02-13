const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("server")
        .setDescription("te tiro la data sobre el server este"),
    async execute(interaction) {
        try {
            await interaction.reply(
                `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`,
            );
        } catch (error) {
            console.log(error);
            await interaction.reply("Salio para el orto esto no se que onda hubo un error");
        }
    },
};
