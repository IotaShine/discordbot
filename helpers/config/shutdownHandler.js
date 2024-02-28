const logger = require("./logger");

/** Agrega un hook al evento de shutdown para cerrar la base de datos y desloguearse
 * @param {Client} client 
 */
function shutdownHandler(client) {
    function gracefulShutdown() {
        logger.info("Shutting down gracefully...");

        if (client.db) {
            client.db.close(() => {
                logger.info("Database connection closed.");
            });
        }

        client.destroy()
            .then(() => {
                logger.info("Logged out successfully.");
                process.exit(0);
            }).catch(error => {
                logger.error(error, "Error while logging out.");
                process.exit(1);
            });
    }

    // Listen for shutdown signals
    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
    process.on("beforeExit", gracefulShutdown);
    process.on("exit", gracefulShutdown);

    // Listen for uncaught exceptions and rejections
    process.on("uncaughtException", error => {
        logger.fatal("Uncaught exception:", error);
        gracefulShutdown();
    });

    process.on("unhandledRejection", error => {
        logger.fatal("Unhandled rejection:", error);
        gracefulShutdown();
    });

}

module.exports = shutdownHandler;
