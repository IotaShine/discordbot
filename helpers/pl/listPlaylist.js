const fs = require("node:fs/promises");

const listPlaylist = async guild => {
    const path = `./helpers/playlists/${guild}.json`;

    try {
        const file = await fs.readFile(path, { encoding: "utf8" });
        if (!file) throw new Error("No existen playlist para este server");

        const data = JSON.parse(file);

        return Object.keys(data);
    } catch (error) {
        return error;
    }
};

module.exports = listPlaylist;
