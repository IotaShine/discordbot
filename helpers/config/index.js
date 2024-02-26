const shutdownHandler = require("./shutdownHandler");
const { createTables } = require("./db");

module.exports = { shutdownHandler, createTables };