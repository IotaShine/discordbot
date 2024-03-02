/**
 * @function updateUsers
 * @param {import("sqlite3").Database} db 
 * @param {import("../types").User[]} users 
 * @returns {Promise<void|error>}
 */
function updateUsers(db, users) {

    return new Promise((resolve, reject) => {
        const stmt = db.prepare("UPDATE users SET xp = ?, level = ? WHERE user_id = ?");
        for (const user of users) {
            stmt.run(user.xp, user.level, user.user_id);
        }
        stmt.finalize(error => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

module.exports = updateUsers;