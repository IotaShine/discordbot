const { SlashCommandBuilder } = require("discord.js");
const logger = require("../../helpers/config/logger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Mencioname a uno y te tiro la data"),

    /** Sends the user info
    * @param {CommandInteraction} interaction
    */
    async execute(interaction) {
        try {
            await interaction.reply(
                `Command run by: ${interaction.user.username}, you joined on ${interaction.member.joinedAt
                }.\nUserId = "${interaction.user.id}"\nServerId = "${interaction.guild.id
                }"\n ChannelId = "${interaction.member.voice.channelId ? interaction.member.voice.channelId : "none"
                }"\nOWNERID = "${process.env.OWNERID}"`,
            );
        } catch (error) {
            logger.error(error, "Error in user command");
            return await interaction.reply("No se que paso pero no funcó el comando");
        }
    },
};
