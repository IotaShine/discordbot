const { SlashCommandBuilder } = require("discord.js");
const { useMainPlayer } = require("discord-player");
const logger = require("../../helpers/config/logger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("connect")
        .setDescription("Me conecto al canal en el que estas vos."),

    /** Connects to the voice channel
    * @param {import("discord.js").Interaction} interaction
    */
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            return await interaction.reply("No estas en un canal de voz salame");
        }

        // TODO - Pedirle a alguien a que me ayude a probar esto
        const player = useMainPlayer();
        const currentQueue = player.queues.get(interaction.guild.id);
        if (currentQueue && currentQueue.connection) {
            return await interaction.reply(
                `Ya estoy conectado a ${currentQueue.connection.channel}`,
            );
        }

        try {
            const queue = player.queues.create(interaction.guild);

            if (!queue.connection) {
                await queue.connect(interaction.member.voice.channel);
            }

            return await interaction.reply(
                `Conectado a ${interaction.member.voice.channel}`,
            );
        } catch (error) {
            logger.error(error, "Error in connect command");
            return await interaction.reply("Ocurrió un error");
        }
    },
};
