const { Events } = require("discord.js");
const { logger, getUser, updateUsers } = require("../helpers/");
const db = require("../helpers/db/database");
const userCache = require("../helpers/db/userCache");

setInterval(async () => {
    const usersArray = Array
        .from(userCache.values())
        .filter(user => user.isDirty)
        .map(user => ({ user_id: user.user_id, xp: user.xp, level: user.level }));
    if (usersArray.length === 0) return;

    try {
        await updateUsers(db, usersArray);
        usersArray.forEach(user => {
            userCache.get(user.user_id).isDirty = false;
        });
        logger.info(`${usersArray.length} users were updated successfully`);
    } catch (error) {
        logger.error(error);
    }

}, 300000);

// NOTE - Maybe make the level be per server and not global?
module.exports = {
    name: Events.MessageCreate,
    /**
     * @function
     * @param {import("discord.js").Message} message
     */
    async execute(message) {
        if (message.author.bot) return;

        const author = message.author;
        const user_id = author.id;
        let user;

        try {
            user = await getUser(user_id);
            userCache.set(user_id, user);
        } catch (error) {
            logger.error(error);
            return;
        }

        user.xp += 1;
        const level = Math.floor(0.1 * Math.sqrt(user.xp));
        if (level > user.level) {
            user.level = level;
            message.channel.send(`Congratulations ${author}, you have leveled up to level ${level}`);
        }

        user.isDirty = true;
    },
};
