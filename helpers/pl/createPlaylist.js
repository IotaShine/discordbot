const createPlaylist = async (playlist, owner, nombre) => {
    const playlistData = {
        nombre,
        owner,
        playlist,
    };

    try {
        const res = await fetch("http://127.0.0.1:8090/api/collections/playlists/records", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(playlistData),
        });
        const data = await res.json();

        if (data.error || res.status !== 200) {
            return new Error("Ocurrió un error al crear la playlist");
        }
    } catch (error) {
        return error;
    }
};

module.exports = createPlaylist;
