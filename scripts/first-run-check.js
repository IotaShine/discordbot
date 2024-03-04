const fs = require("fs");
const path = require("path");
const { logger } = require("../src/helpers");

const filePath = path.join(__dirname, "../first-run.lock");

/**
 * Check if this is the first run of the bot
 */
function checkFirstRun() {
    try {
        if (!fs.existsSync(filePath)) {
            logger.info("Updating bot commands since it's the first run.");

            const updateGuildCommands = require("./deploy-commands");
            updateGuildCommands();
            const updateGlobalCommands = require("./deploy-commands-global");
            updateGlobalCommands();

            logger.info("Bot commands updated. It might take a while for the changes to take effect.");

            fs.writeFileSync(filePath, "This marks the first run of the bot.");
        }
    } catch (error) {
        logger.error(error, "Error checking first run.");
    }
}

module.exports = checkFirstRun;