const fs = require("node:fs/promises");

const playlistPlay = async (guild, nombre) => {
    const path = `./helpers/playlists/${guild}.json`;

    try {
        const file = await fs.readFile(path, { encoding: "utf8" });

        const data = JSON.parse(file);
        if (!data[nombre]) return null;

        return data[nombre];
    } catch (error) {
        return error;
    }
};

module.exports = playlistPlay;
