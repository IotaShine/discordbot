/**
 * @param {import("discord.js").Message} message 
 * @param {string} id 
 */
function getUser(message, id) {
    const db = message.client.db;
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE user_id = ?", [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

module.exports = getUser;