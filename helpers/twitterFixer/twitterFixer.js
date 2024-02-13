const { requestServers } = require("./requestServers");

const twitterfixer = message => {
    if (!message.content || message.author.bot) return;

    if (!requestServers()) return;

    if (message.content.includes("https://twitter.com")) {
        const newMessage = message.content.replaceAll(
            "https://twitter.com",
            "https://fxtwitter.com",
        );

        message.channel.send(newMessage);
    }

    if (message.content.includes("https://x.com")) {
        const newMessage = message.content.replaceAll("https://x.com", "https://fixupx.com/");

        message.channel.send(newMessage);
    }
};

module.exports = twitterfixer;
