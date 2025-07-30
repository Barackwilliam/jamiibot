const fs = require("fs-extra");

const WARNING_DB = "./warnings.json";

// Ensure warning database exists
if (!fs.existsSync(WARNING_DB)) fs.writeJsonSync(WARNING_DB, {});

function isLink(text) {
  const regex = /(https?:\/\/[^\s]+|wa\.me\/\d+|chat\.whatsapp\.com\/[^\s]+)/gi;
  return regex.test(text);
}

function addWarning(userId) {
  const warnings = fs.readJsonSync(WARNING_DB);
  if (!warnings[userId]) warnings[userId] = 0;
  warnings[userId]++;
  fs.writeJsonSync(WARNING_DB, warnings);
  return warnings[userId];
}

module.exports = {
  name: "linkDetector",
  description: "Detects links and warns user with count",
  
  async handler(sock) {
    sock.ev.on("messages.upsert", async ({ messages, type }) => {
      if (type !== "notify") return;

      const msg = messages[0];
      if (!msg.message || msg.key.fromMe) return;

      const textMessage =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        "";

      const sender = msg.key.participant || msg.key.remoteJid;

      if (isLink(textMessage)) {
        const warningCount = addWarning(sender);

        const replyText = `⚠️ Umetuma link bila ruhusa.\n\nWarning ya ${warningCount}/3 kwa *@${sender.split("@")[0]}*.\nNasubiri ruhusa ya admin ili utolewe group.`;
        
        await sock.sendMessage(
          msg.key.remoteJid,
          {
            text: replyText,
            mentions: [sender],
          },
          { quoted: msg }
        );

        // Optional: notify admin privately
        if (warningCount >= 3) {
          const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
          const admins = groupMetadata.participants.filter(p => p.admin);
          const adminJid = admins[0]?.id || null;

          if (adminJid) {
            await sock.sendMessage(adminJid, {
              text: `🚨 *${sender}* amefikisha warning 3 kwa kutuma links kwenye group: ${groupMetadata.subject}.\nRuhusu kuondolewa au fanya uamuzi.`
            });
          }
        }
      }
    });
  }
};
