const pino = require("pino");
const path = require("path");

const logDirectory = path.join(__dirname, "../../logs/bot.log");

const transport = pino.transport({
    targets: [
        {
            target: "pino-pretty",
            options: {
                colorize: true,
                ignore: "pid,hostname",
                translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
            },
        },
        {
            target: "pino/file",
            level: "error",
            options: {
                destination: logDirectory,
                mkdir: true,
            },
        },

    ],
});

/**
 * @type {import("pino").Logger}
 */
const logger = pino(transport);

module.exports = logger;