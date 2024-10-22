const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const logger = require("../config/logger");

const dbDir = path.join(__dirname, "../../../database");

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(
    path.join(__dirname, "../../../database/discordDB.sqlite3"),
    err => {
        if (err) {
            logger.fatal(err.message);
            process.exit(1);
        }
        logger.info("Connected to database successfully.");
    },
);

module.exports = db;
