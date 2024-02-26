const guildsTableQuery = "CREATE TABLE IF NOT EXISTS guilds (guild_id TEXT PRIMARY KEY)";
const usersTableQuery = "CREATE TABLE IF NOT EXISTS users (user_id TEXT PRIMARY KEY)";
const playlistsTableQuery = `CREATE TABLE IF NOT EXISTS playlists (
    creator TEXT NOT NULL, 
    playlist_id INTEGER NOT NULL UNIQUE, 
    guild TEXT, 
    songs TEXT, 
    nombre TEXT NOT NULL DEFAULT 'Playlist',
    FOREIGN KEY(creator) REFERENCES users(user_id), 
    PRIMARY KEY(playlist_id AUTOINCREMENT), 
    FOREIGN KEY(guild) REFERENCES guilds(guild_id)
    UNIQUE(creator, nombre)
  )`;

/** 
 * Create the tables in the database
 * @param {Database} db
 */
const createTables = (db) => {
    db.serialize(() => {
        db.run(guildsTableQuery);
        db.run(usersTableQuery);
        db.run(playlistsTableQuery);
    });
};


module.exports = { createTables };