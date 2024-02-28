const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
const logger = require("../../helpers/config/logger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Me desconecto del canal de voz."),

    /** Leaves the voice channel
    * @param {CommandInteraction} interaction
    */
    async execute(interaction) {
        const vc = interaction.member.voice.channel;
        if (!vc) {
            return await interaction.reply("No estas en un canal de voz salame");
        }

        try {
            const queue = useQueue(interaction.guild.id);
            if (!queue) return await interaction.reply("Que haces bobo");

            queue.connection.destroy();
            return await interaction.reply(`Desconectado de ${vc}`);
        } catch (error) {
            logger.error(error, "Error in leave command");
            return await interaction.reply("Ocurrió un error");
        }
    },
};
