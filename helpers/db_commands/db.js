const guildsTableQuery = "CREATE TABLE IF NOT EXISTS guilds (guild_id TEXT PRIMARY KEY, playlists JSON DEFAULT '[]')";
const usersTableQuery = "CREATE TABLE IF NOT EXISTS users (user_id TEXT PRIMARY KEY, playlists JSON DEFAULT '[]')";

const createTables = (db) => {
    db.serialize(() => {
        db.run(guildsTableQuery);
        db.run(usersTableQuery);
    });

    db.end();
};


module.exports = { createTables };