const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Me desconecto del canal de voz."),

    /** Leaves the voice channel
    * @param {CommandInteraction} interaction
    */
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            return await interaction.reply("No estas en un canal de voz salame");
        }

        try {
            const queue = useQueue(interaction.guild.id);
            if (!queue) return await interaction.reply("Que haces bobo");

            queue.connection.destroy();
            return await interaction.reply(
                `Desconectado de ${interaction.member.voice.channel}`,
            );
        } catch (error) {
            console.log(error);
            return await interaction.reply("Ocurrió un error");
        }
    },
};
