const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("comando para invitarme a otros servers"),
    async execute(interaction) {
        try {
            await interaction.reply(
                "Podes invitarme haciendo [click aca](https://discord.com/api/oauth2/authorize?client_id=959872678884425768&permissions=17740865203414&scope=bot)",
            );
        } catch (error) {
            console.log(error);
            return await interaction.reply("Ocurrio un pequeño errorcito");
        }
    },
};
