const { EmbedBuilder } = require("discord.js");

/**
 *
 * @param {import("discord-player").GuildQueue} queue
 * @param {import("discord-player").Track} track
 */
function onPlayerStart(queue, track) {
    const { title, thumbnail } = track;

    const embed = new EmbedBuilder()
        .setTitle(`Now Playing: **【${title}】**`)
        .setColor("Random")
        .setFields([
            { name: "From", value: track.author, inline: true },
            { name: "Duration", value: track.duration, inline: true },
        ])
        .setThumbnail(thumbnail)
        .setFooter({ text: `Requested by ${track.requestedBy?.tag}` });

    queue.metadata.channel.send({ embeds: [embed] });
}

module.exports = onPlayerStart;
