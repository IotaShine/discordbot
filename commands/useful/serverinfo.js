const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("te tiro la data sobre el server este"),
    /** Sends the server info
    * @param {CommandInteraction} interaction
    */
    async execute(interaction) {

        const { guild } = interaction;
        const { name, memberCount, createdAt, joinedAt, ownerId } = guild;

        const icon = guild.iconURL();

        const embedDescription = `Nombre: \`${name}\`\nCantidad de miembros: ${memberCount}\nFecha de creación: ${createdAt}\nTe uniste el: ${joinedAt} \nOwner: <@${ownerId}>.`;

        const embed = new EmbedBuilder()
            .setTitle(`Server info for: ${name}`)
            .setDescription(embedDescription)
            .setColor("Random")
            .setThumbnail(icon);

        try {
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.log(error);
            await interaction.reply("Salio para el orto esto no se que onda hubo un error");
        }
    },
};
