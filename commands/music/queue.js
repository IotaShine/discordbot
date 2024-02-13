const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("queue").setDescription("muestra que esta en cola"),

    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            await interaction.reply("No estas en un canal de voz salame");
            return;
        }

        const queue = await interaction.client.player.nodes.get(interaction.guild.id);
        if (!queue) return await interaction.reply("La cola esta vacia negro");

        const { data } = queue.tracks;

        if (!data || data.lenght === 0) {
            return await interaction.reply("La cola esta vacia negro");
        }

        await interaction.deferReply();

        try {
            const { currentTrack, durationFormatted } = queue;
            const songs = [currentTrack, ...data];
            const canciones = songs
                .slice(0, 10)
                .map((cancion, i) => {
                    const { duration, url } = cancion;
                    const { title } = cancion.raw;
                    return `${i + 1}. [${title}](${url}) - [${duration}]`;
                })
                .join("\n");

            return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Random")
                        .setThumbnail(currentTrack.thumbnail)
                        .setTitle("Canciones en cola")
                        .setDescription(canciones)
                        .setFooter({
                            text: `Canciones en cola: ${songs.length}\nDuración: ${durationFormatted}`,
                        }),
                ],
            });
        } catch (error) {
            console.log(error);
            return interaction.followUp("Ocurrio un error");
        }
    },
};
