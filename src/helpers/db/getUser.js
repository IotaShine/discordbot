const createUser = require("./createUser");
const db = require("./database");
const userCache = require("./userCache");
/**
 * @param {string} id
 * @returns {Promise<import("../types").User>}
 */
function getUser(id) {

    if (userCache.has(id)) {
        return Promise.resolve(userCache.get(id));
    }

    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE user_id = ?", [id], async (err, row) => {
            if (err) {
                reject(err);
            } else if (!row) {
                const user = await createUser(id);
                userCache.set(id, user);
                resolve(user);
            } else {
                resolve(row);
            }
        });
    });
}

module.exports = getUser;