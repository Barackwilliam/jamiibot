// commands/warn.js

// Simple in-memory storage ya warn count (bado haistore permanently)
const warnData = {};

// WARN limit ya default (baliisha kama unataka)
const WARN_LIMIT = 3;

module.exports = {
  description: "⚠️ Warn user in group. Admin only.",
  usage: ".warn (reply to user message) | .warn reset (reply to user message to reset warn count)",
  
  async execute(sock, msg, args) {
    // Kwa mfano msg.key.remoteJid ni group id, msg.key.participant ni sender
    const isGroup = msg.key.remoteJid.endsWith("@g.us");
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;

    if (!isGroup) {
      return await sock.sendMessage(from, { text: "⛔ Command hii ni ya group tu." }, { quoted: msg });
    }

    // Check if sender ni admin - utahitaji code kuangalia admin status group
    // Hapa ni simple stub, lazima ubadilishe na method halisi ya bot yako
    const groupMetadata = await sock.groupMetadata(from);
    const admins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id);
    const isAdmin = admins.includes(sender);

    if (!isAdmin) {
      return await sock.sendMessage(from, { text: "❌ Huna ruhusa. Command hii ni ya admin tu." }, { quoted: msg });
    }

    // Check reply message
    const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const quotedSender = msg.message?.extendedTextMessage?.contextInfo?.participant;

    if (!quotedMsg || !quotedSender) {
      return await sock.sendMessage(from, { text: "⚠️ Tafadhali reply message ya mtu unayetaka kumwarn." }, { quoted: msg });
    }

    try {
      if (args.length === 0 || args[0].toLowerCase() !== "reset") {
        // Warn the user
        warnData[quotedSender] = (warnData[quotedSender] || 0) + 1;

        if (warnData[quotedSender] >= WARN_LIMIT) {
          await sock.sendMessage(from, { text: `⚠️ Mtumiaji @${quotedSender.split("@")[0]} amefikia limit ya warnings na atatolewa.` , mentions: [quotedSender]}, { quoted: msg });
          await sock.groupParticipantsUpdate(from, [quotedSender], "remove");
          warnData[quotedSender] = 0; // reset after removal
        } else {
          const left = WARN_LIMIT - warnData[quotedSender];
          await sock.sendMessage(from, { text: `⚠️ Mtumiaji @${quotedSender.split("@")[0]} amepokea warning. Warnings zilizobaki kabla ya kufukuzwa: ${left}`, mentions: [quotedSender] }, { quoted: msg });
        }
      } else if (args[0].toLowerCase() === "reset") {
        // Reset warn count
        warnData[quotedSender] = 0;
        await sock.sendMessage(from, { text: `✅ Warn count imereset kwa mtumiaji @${quotedSender.split("@")[0]}.`, mentions: [quotedSender] }, { quoted: msg });
      }
    } catch (error) {
      console.error("Warn command error:", error);
      await sock.sendMessage(from, { text: "❌ Kosa limetokea kwenye command ya warn, jaribu tena baadaye." }, { quoted: msg });
    }
  },
};
