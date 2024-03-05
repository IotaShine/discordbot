const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { logger } = require("../../helpers/");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("I list all my commands."),

    /** Sends a list of the commands
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            const { commands, user } = interaction.client;
            await interaction.deferReply();

            const author = {
                name: user.username,
                iconURL: user.avatarURL({
                    extension: "png",
                    size: 128,
                }),
            };
            const description = makeDescription(commands);
            const embed = new EmbedBuilder()
                .setAuthor(author)
                .setColor("Blue")
                .setDescription(description);

            return await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            logger.error(error, "Error in help command");
            await interaction.reply("**[ ERROR ]** There was an error listing the commands.");
        }
    },
};

function sortCommands(a, b) {
    if (a.data.name > b.data.name) return 1;
    if (a.data.name < b.data.name) return -1;
    return 0;
}

function makeDescription(commands) {
    return commands.sort(sortCommands).map(command => (`**[ /${command.data.name} ]** - ${command.data.description}`)).join("\n");
}