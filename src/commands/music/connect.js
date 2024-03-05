const { SlashCommandBuilder } = require("discord.js");
const { useMainPlayer } = require("discord-player");
const { logger } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("connect")
        .setDescription("I connect to the your voice channel"),

    /** Connects to the voice channel
    * @param {import("discord.js").CommandInteraction} interaction
    */
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            return await interaction.reply("**[ WARNING ]** You need to be in a voice channel.");
        }

        // TODO - Pedirle a alguien a que me ayude a probar esto
        const player = useMainPlayer();
        const currentQueue = player.queues.get(interaction.guild.id);
        if (currentQueue && currentQueue.connection) {
            return await interaction.reply(
                `**[ NOTICE ]** I'm already in ${currentQueue.connection.channel}`,
            );
        }

        try {
            const queue = player.queues.create(interaction.guild);

            if (!queue.connection) {
                await queue.connect(interaction.member.voice.channel);
            }

            return await interaction.reply(
                `**[ NOTICE ]** Connected to ${interaction.member.voice.channel}`,
            );
        } catch (error) {
            logger.error(error, "Error in connect command");
            return await interaction.reply("**[ ERROR ]** There was an error connecting to the voice channel.");
        }
    },
};
