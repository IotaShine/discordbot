const requestTracks = async (guild, nombre) => {
    try {
        const res = await fetch(
            `http://127.0.0.1:8090/api/collections/single_playlist/records?filter=(nombre~'${nombre}')`,
        );
        const data = await res.json();
        console.log(data);
        if (!data || res.status !== 200) {
            throw new Error("Ocurrió un error al listar las playlists");
        }
        return data.items[0].playlist;
    } catch (error) {
        return error;
    }
};

module.exports = requestTracks;
