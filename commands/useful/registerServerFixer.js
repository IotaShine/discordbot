const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("registerserver")
        .setDescription("Register this server to be have twitter links fixed"),
    async execute(interaction) {
        // get the server id
        const serverId = interaction.guild.id;
        const res = await fetch("http://127.0.0.1:8090/api/collections/registeredServers/records", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ server: serverId, activated: true }),
        });

        if (res.status === 200) {
            await interaction.reply("Servidor registrado correctamente");
            return;
        }

        const { data } = await res.json();

        if (data.server.code == "validation_not_unique") {
            await interaction.reply("Este servidor ya está registrado");
            return;
        }

        await interaction.reply("Ocurrió un error al registrar el servidor");
        return;
    },
};
