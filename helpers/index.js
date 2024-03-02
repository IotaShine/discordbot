// Config
const logger = require("./config/logger");
const shutdownHandler = require("./config/shutdownHandler");

// DB
const createTables = require("./db/createTables");
const createUser = require("./db/createUser");
const updateUsers = require("./db/updateUsers");
const getUser = require("./db/getUser");


// Meme
const r34Helper = require("./meme/r34_helper");

// Music Playlist
const add = require("./music/add");
const list = require("./music/list");
const play = require("./music/play");
const remove = require("./music/remove");
const save = require("./music/save");

module.exports = {
    add,
    createTables,
    createUser,
    updateUsers,
    getUser,
    list,
    logger,
    play,
    r34Helper,
    remove,
    save,
    shutdownHandler,
};