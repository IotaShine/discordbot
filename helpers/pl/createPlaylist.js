/**
 * 
 * @param {object} client 
 * @param {string} playlist 
 * @param {string} owner 
 * @param {string} nombre 
 * @returns 
 */
const createPlaylist = async (client, playlist, owner, nombre) => {
    const playlistData = {
        nombre,
        owner,
        playlist,
    };

    // sqlite3 database add playlist
    const db = client.db;
    const sql = "INSERT INTO users (user_id, playlists) VALUES(?, ?)";

};

module.exports = createPlaylist;
