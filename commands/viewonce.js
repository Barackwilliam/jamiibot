module.exports = {
  viewonce: {
    description: "👀 Fungua media ya 'view once' kama picha au video",
    usage: ".viewonce (reply kwenye picha/video yenye view once)",
    async execute(sock, msg, args) {
      try {
        const contextInfo = msg.message?.extendedTextMessage?.contextInfo;
        if (!contextInfo || !contextInfo.quotedMessage) {
          return "⚠️ Tafadhali jibu (reply) kwenye picha au video yenye 'view once'.";
        }

        const quotedMsg = contextInfo.quotedMessage;

        // Jaribu kuchukua viewOnceMessage au viewOnceMessageV2 kama kawaida
        let viewOnce = quotedMsg.viewOnceMessage || quotedMsg.viewOnceMessageV2;

        // Kama hazipo, jaribu kuchukua image/video kwenye root na angalia flag ya viewOnce
        let mediaType = null;
        if (!viewOnce) {
          if (quotedMsg.imageMessage && quotedMsg.viewOnce === true) {
            viewOnce = { imageMessage: quotedMsg.imageMessage };
            mediaType = 'imageMessage';
          } else if (quotedMsg.videoMessage && quotedMsg.viewOnce === true) {
            viewOnce = { videoMessage: quotedMsg.videoMessage };
            mediaType = 'videoMessage';
          }
        } else {
          // ViewOnceMessage found - angalia ni picha au video
          if (viewOnce.imageMessage) mediaType = 'imageMessage';
          else if (viewOnce.videoMessage) mediaType = 'videoMessage';
        }

        if (!viewOnce || !mediaType) {
          return "⚠️ Ujumbe ulioreply haujumuishi picha au video ya 'view once'.";
        }

        const buffer = await sock.downloadMediaMessage({
          message: { [mediaType]: viewOnce[mediaType] },
          key: {
            remoteJid: msg.key.remoteJid,
            id: contextInfo.stanzaId,
            fromMe: false,
            participant: contextInfo.participant
          }
        });

        if (mediaType === 'imageMessage') {
          await sock.sendMessage(msg.key.remoteJid, {
            image: buffer,
            caption: viewOnce.imageMessage.caption || ''
          }, { quoted: msg });
        } else if (mediaType === 'videoMessage') {
          await sock.sendMessage(msg.key.remoteJid, {
            video: buffer,
            caption: viewOnce.videoMessage.caption || ''
          }, { quoted: msg });
        }

        return "✅ 'View once' media imetumwa tena.";
      } catch (error) {
        console.error('ViewOnce command error:', error);
        return "❌ Tatizo limetokea wakati wa kufungua 'view once'. Jaribu tena baadaye.";
      }
    }
  }
};
