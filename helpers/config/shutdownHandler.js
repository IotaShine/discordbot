/** Agrega un hook al evento de shutdown para cerrar la base de datos y desloguearse
 * @param {Client} client 
 */
function shutdownHandler(client) {
    function gracefulShutdown() {
        console.log("Shutting down gracefully...");

        if (client.db) {
            client.db.close(() => {
                console.log("Database connection closed.");
            });
        }

        client.destroy()
            .then(() => {
                console.log("Logged out successfully.");
                process.exit(0);
            }).catch(error => {
                console.log("There was an error while logging out");
                console.log(error);
                process.exit(1);
            });
    }

    // Listen for shutdown signals
    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
}

module.exports = shutdownHandler;
