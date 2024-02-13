const listPlaylist = async guild => {

    try {
        const res = await fetch(`http://127.0.0.1:8090/api/collections/single_playlist/records?filter=(server~'${guild}')`);
        const data = await res.json();
        console.log(data);
        if (data.error || res.status !== 200) throw new Error("Ocurrió un error al listar las playlists");
        return data.items;
    } catch (error) {
        return error;
    }


};

module.exports = listPlaylist;
