const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Te tiro la data de mis comandos"),
    async execute(interaction) {
        try {
            const { commands, user } = interaction.client;
            await interaction.deferReply();
            return await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: user.username,
                            iconURL: user.avatarURL({
                                extension: "png",
                                size: 128,
                            }),
                        })
                        .setColor("Blue")
                        .setDescription(
                            commands
                                .sort((a, b) => {
                                    if (a.data.name > b.data.name) {
                                        return 1;
                                    }
                                    if (a.data.name < b.data.name) {
                                        return -1;
                                    }
                                    return 0;
                                })
                                .map(command => {
                                    return `**[ /${command.data.name} ]** - ${command.data.description}`;
                                })
                                .join("\n"),
                        ),
                ],
            });
        } catch (error) {
            console.log(error);
            await interaction.reply("Ocurrio un error");
        }
    },
};
