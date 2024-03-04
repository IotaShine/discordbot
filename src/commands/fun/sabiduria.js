const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const escrituras = require("../../helpers/meme/escrituras.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sabiduría")
        .setDescription("Sabiduría"),

    /** Sends a random escritura
    * @param {import("discord.js").CommandInteraction} interaction
    */
    async execute(interaction) {
        const escritura = escrituras[Math.floor(Math.random() * escrituras.length)];
        const embed = new EmbedBuilder()
            .setAuthor({ name: escritura.titulo })
            .setDescription(escritura.escritura)
            .setFooter({ text: `Autor: ${escritura.autor}` })
            .setColor("Random");

        return await interaction.reply({ embeds: [embed] });
    },
};