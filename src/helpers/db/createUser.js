const logger = require("../config/logger");
const db = require("./database");
/**
 * @param {import("discord.js").Message} message 
 * @param {string} id 
 */
function createUser(id) {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO users (user_id, xp, level) VALUES (?, ?, ?)", [id, 0, 0], (err) => {
            if (err) {
                logger.error(err, "Failed to create user");
                reject(new Error("Failed to create user"));
            } else {
                resolve({ id, xp: 0, level: 0, isDirty: false });
            }
        });
    });

}

module.exports = createUser;