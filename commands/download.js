const axios = require('axios');
const mime = require('mime-types');
const { MessageType } = require('@whiskeysockets/baileys');

const downloadCommands = {
    download: {
        description: "Pakua na tuma faili kutoka URL",
        usage: ".download [url]",
        execute: async (sock, msg, args) => {
            const url = args[0];

            if (!url) {
                return "⚠️ Tafadhali weka URL ya faili mfano:\n.download https://example.com/sample.pdf";
            }

            try {
                const response = await axios.get(url, {
                    responseType: 'arraybuffer'
                });

                const buffer = Buffer.from(response.data, 'binary');
                const fileType = mime.lookup(url) || 'application/octet-stream';
                const fileName = `file.${mime.extension(fileType) || 'bin'}`;

                await sock.sendMessage(msg.key.remoteJid, {
                    document: buffer,
                    fileName: fileName,
                    mimetype: fileType,
                });

                return `✅ *Faili imetumwa* kama: ${fileName}`;
            } catch (error) {
                console.error("Download error:", error);
                return "❌ Samahani, imeshindikana kupakua faili. Hakikisha URL ni sahihi na faili linapatikana.";
            }
        }
    }
};

module.exports = downloadCommands;
