function shutdownHandler(client) {
    function gracefulShutdown() {
        console.log("Shutting down gracefully...");

        if (client.db) {
            client.db.close(() => {
                console.log("Database connection closed.");
            });
        }

        client.destroy();
        process.exit(0);
    }

    // Listen for shutdown signals
    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
}

module.exports = shutdownHandler;