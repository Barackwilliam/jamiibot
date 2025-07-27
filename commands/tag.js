// commands/tag.js

const helpers = require('../config/helpers');

module.exports = {
    tag: {
        description: "📢 Mtaje mtu mmoja au kundi zima kwa ujumbe 💬",
        usage: ".tag @user | @all ujumbe",
        async execute(sock, msg, args) {
            const isGroup = msg.key.remoteJid.endsWith('@g.us');
            if (!isGroup) return "⛔ Samahani, command hii inapatikana tu ndani ya group.";

            const messageText = args.join(' ').trim();
            if (!messageText) return "⚠️ Tafadhali andika ujumbe unaotaka kutuma mfano .tag @jina habari Au .tagall habari.";

            const mentions = await helpers.generateMentions(sock, msg, args);
            if (!mentions.length) {
                return "⚠️ Hakuna mtu Uliyemtag. Hakikisha umetumia  .tag 'namba ya mtu au .tagall kwenye ujumbe wako.";
            }

            return {
                text: `📣 ${messageText}`,
                mentions
            };
        }
    }
};
