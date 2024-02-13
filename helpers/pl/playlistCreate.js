const fs = require("node:fs/promises");

const playlistCreate = async (playlist, guild, nombre) => {
    const path = `./helpers/playlists/${guild}.json`;
    console.log(playlist);
    try {
        const file = await fs.readFile(path, { encoding: "utf8" });

        const data = JSON.parse(file);
        if (data[nombre]) return "Esa playlist ya existe";

        const newPlaylist = { ...(await data), [nombre]: playlist };
        fs.writeFile(path, JSON.stringify(newPlaylist), { encoding: "utf8" });
    } catch (error) {
        fs.writeFile(path, JSON.stringify({ [nombre]: playlist }), { encoding: "utf8" });
    }
};

module.exports = playlistCreate;
