const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("te respondo con la fotito del que menciones")
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("The user you want the avatar")
                .setRequired(true),
        ),
    async execute(interaction) {
        try {
            await interaction.reply(
                (await interaction.options.getUser("target").avatarURL()) + "?size=1024",
            );
        } catch (error) {
            console.log(error);
            await interaction.reply("Ocurrio un error");
        }
    },
};
