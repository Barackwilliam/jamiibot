// commands/hug.js

const axios = require("axios");
const fs = require("fs-extra");
const { exec } = require("child_process");
const { unlink } = require("fs").promises;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const GIFBufferToVideoBuffer = async (image) => {
    const filename = `${Math.random().toString(36).substring(2, 8)}`;
    await fs.writeFileSync(`./${filename}.gif`, image);

    await new Promise((resolve) => {
        exec(
            `ffmpeg -i ./${filename}.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ./${filename}.mp4`,
            resolve
        );
    });

    await sleep(2000);

    const buffer = await fs.readFileSync(`./${filename}.mp4`);
    await unlink(`./${filename}.gif`);
    await unlink(`./${filename}.mp4`);
    return buffer;
};

module.exports = {
    description: "🎭 Tuma reaction ya 'hug' 🤗",
    usage: ".hug (reply message)",
    async execute(sock, msg, args) {
        const reactionName = "hug";
        const isGroup = msg.key.remoteJid.endsWith("@g.us");
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;

        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const quotedSender = msg.message?.extendedTextMessage?.contextInfo?.participant;

        try {
            const url = `https://api.waifu.pics/sfw/${reactionName}`;
            const response = await axios.get(url);
            const gifBuffer = (
                await axios.get(response.data.url, { responseType: "arraybuffer" })
            ).data;

            const videoBuffer = await GIFBufferToVideoBuffer(gifBuffer);

            let caption;
            let mentions;

            if (quotedMsg && quotedSender) {
                caption = `@${sender.split("@")[0]} ${reactionName} @${quotedSender.split("@")[0]}`;
                mentions = [sender, quotedSender];
            } else {
                caption = `@${sender.split("@")[0]} ${reactionName} everyone`;
                mentions = [sender];
            }

            await sock.sendMessage(
                from,
                {
                    video: videoBuffer,
                    gifPlayback: true,
                    caption,
                    mentions,
                },
                { quoted: msg }
            );
        } catch (error) {
            console.error("Reaction error:", error);
            return await sock.sendMessage(from, { text: "⚠️ Imeshindikana kupakia reaction, tafadhali jaribu tena." }, { quoted: msg });
        }
    },
};
