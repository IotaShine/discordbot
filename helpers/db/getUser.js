const db = require("./database");
/**
 * @param {string} id 
 */
function getUser(id) {
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