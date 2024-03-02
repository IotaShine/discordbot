const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const logger = require("../config/logger");

const db = new sqlite3.Database(path.join(__dirname, "../../database/discordDB.sqlite3"), err => {
    if (err) {
        logger.fatal(err.message);
        process.exit(1);
    }
    logger.info("Connected to database successfully.");
});

module.exports = db;