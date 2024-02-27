const { SlashCommandBuilder } = require("discord.js");
const { useMainPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("connect")
        .setDescription("Me conecto al canal en el que estas vos."),

    /** Connects to the voice channel
    * @param {CommandInteraction} interaction
    */
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            return await interaction.reply("No estas en un canal de voz salame");
        }

        try {
            const player = useMainPlayer();

            const queue = player.queues.create(interaction.guild);

            if (!queue.connection) {
                await queue.connect(interaction.member.voice.channel);
            }

            return await interaction.reply(
                `Conectado a ${interaction.member.voice.channel}`,
            );
        } catch (error) {
            console.log(error);
            return await interaction.reply("Ocurrió un error");
        }
    },
};
