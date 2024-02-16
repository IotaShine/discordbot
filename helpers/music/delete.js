const { EmbedBuilder } = require("@discordjs/builders");

const deletePlaylist = async (client, owner, nombre) => {
    const db = client.db;
    const playlistSqlQuery = "DELETE FROM playlists WHERE creator = ? AND nombre = ?";

    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(playlistSqlQuery, [owner, nombre], err => {
                if (err) {
                    reject(new Error(err.message));
                }
            });
        });

        resolve("Playlist eliminada");
    });
};

const remove = async (interaction) => {
    try {
        const { client } = interaction;
        const user_id = interaction.user.id;
        const nombre = await interaction.options.getString("nombre");
        const a = await deletePlaylist(client, user_id, nombre);

        if (a instanceof Error) throw a;

        return await interaction.reply(a);
    } catch (error) {
        console.log(error);
        const embed = new EmbedBuilder().setTitle("Error").setDescription(error.message).setColor("Red");
        return await interaction.reply({ embeds: [embed] });
    }
};

module.exports = remove;