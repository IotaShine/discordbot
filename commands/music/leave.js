const { SlashCommandBuilder } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Me desconecto del canal de voz."),
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            return await interaction.reply("No estas en un canal de voz salame");
        }

        try {
            const queue = await interaction.client.player.nodes.get(interaction.guild.id);
            if (!queue) return await interaction.reply("Que haces bobo");

            await queue.connection.destroy();
            return await interaction.reply(
                `Desconectado de ${interaction.member.voice.channel}`,
            );
        } catch (error) {
            console.log(error);
            return await interaction.reply("Ocurrio un error");
        }
    },
};
