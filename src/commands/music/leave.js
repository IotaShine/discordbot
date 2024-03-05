const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
const { logger } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("I disconnect from the voice channel."),

    /** Leaves the voice channel
    * @param {import("discord.js").CommandInteraction} interaction
    */
    async execute(interaction) {
        const vc = interaction.member.voice.channel;
        if (!vc) {
            return await interaction.reply("**[ NOTICE ]** You need to be in a voice channel.");
        }

        try {
            const queue = useQueue(interaction.guild.id);
            if (queue && queue.connection && queue.connection.channel.id !== vc.id) {
                return await interaction.reply(`**[ NOTICE ]** I can't leave since you're not in ${queue.connection.channel}`);
            }
            if (!queue) return await interaction.reply("**[ NOTICE ]** I'm not in a voice channel.");

            queue.connection.destroy();
            return await interaction.reply(`**[ NOTICE ]** Leaving ${vc}...`);
        } catch (error) {
            logger.error(error, "Error in leave command");
            return await interaction.reply("**[ ERROR ]** There was an error disconnecting from the voice channel.");
        }
    },
};
