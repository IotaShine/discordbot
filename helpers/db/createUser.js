/**
 * @param {import("discord.js").Message} message 
 * @param {string} id 
 */
function createUser(message, id) {
    const db = message.client.db;
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO users (user_id, xp, level) VALUES (?, ?, ?)", [id, 0, 0], (err) => {
            if (err) {
                reject(new Error("Failed to create user"));
            } else {
                resolve({ id, xp: 0, level: 0 });
            }
        });
    });

}

module.exports = createUser;