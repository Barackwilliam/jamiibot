//commands/admin.js
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const config = require('../config/config'); // config.admins must be an array

// Path for owner file
const ownerPath = path.join(__dirname, '..', 'owner.json');

// Helper to get/set owner
function getOwner() {
    if (!fs.existsSync(ownerPath)) return null;
    const data = fs.readFileSync(ownerPath, 'utf-8');
    return JSON.parse(data).jid;
}

function setOwner(jid) {
    const data = { jid };
    fs.writeFileSync(ownerPath, JSON.stringify(data, null, 2));
}

const adminCommands = {
    // ✅ Set Owner
    setowner: {
        description: "Set the owner (only if not set)",
        usage: ".setowner",
        async execute(sock, msg) {
            const currentOwner = getOwner();
            if (currentOwner) {
                return await sock.sendMessage(msg.key.remoteJid, { text: `⚠️ Owner already set.` });
            }
            const jid = msg.key.participant || msg.key.remoteJid;
            setOwner(jid);
            return await sock.sendMessage(msg.key.remoteJid, { text: `✅ Owner set successfully.` });
        }
    },

    // ✅ Ping Owner
    adminping: {
        description: "Check if you are the owner",
        usage: ".adminping",
        async execute(sock, msg) {
            const jid = msg.key.participant || msg.key.remoteJid;
            const owner = getOwner();
            if (jid !== owner) {
                return await sock.sendMessage(msg.key.remoteJid, { text: `⛔ Access denied.` });
            }
            return await sock.sendMessage(msg.key.remoteJid, { text: `✅ You are the owner.` });
        }
    },

    // ✅ Ban User
    ban: {
        description: "Ban a user from using the bot",
        usage: ".ban @user",
        adminOnly: true,
        async execute(sock, msg, args, db, helpers) {
            const mention = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            if (!mention) return "❌ Please mention a user to ban!";

            const number = helpers.extractNumber(mention);
            if (helpers.isAdmin(mention)) return "❌ Cannot ban an admin!";

            await db.saveUser(number, { banned: true, bannedAt: Date.now() });
            return `🚫 User @${number} has been *banned* from using the bot.`;
        }
    },

    // ✅ Unban
    unban: {
        description: "Unban a user",
        usage: ".unban @user",
        adminOnly: true,
        async execute(sock, msg, args, db, helpers) {
            const mention = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            if (!mention) return "❌ Please mention a user to unban!";

            const number = helpers.extractNumber(mention);
            await db.saveUser(number, { banned: false, unbannedAt: Date.now() });
            return `✅ User @${number} has been *unbanned*.`;
        }
    },

    // ✅ Broadcast
    broadcast: {
        description: "Broadcast a message to all users",
        usage: ".broadcast <message>",
        ownerOnly: false,
        async execute(sock, msg, args, db, helpers) {
            const jid = msg.key.participant || msg.key.remoteJid;
            if (jid !== getOwner()) return "⛔ Only the owner can broadcast.";
            if (!args.length) return "❌ Provide message to broadcast!";

            const text = args.join(' ');
            const users = await db.getUsers();
            let sent = 0, failed = 0;

            for (const id of Object.keys(users)) {
                try {
                    await sock.sendMessage(id + '@s.whatsapp.net', {
                        text: `📢 *BROADCAST*

${text}

_This message was sent to all bot users._`
                    });
                    sent++;
                    await helpers.sleep(1000);
                } catch {
                    failed++;
                }
            }

            return `📬 *Broadcast completed*\n✅ Sent: ${sent}\n❌ Failed: ${failed}`;
        }
    },

    // ✅ Stats
    stats: {
        description: "Get bot statistics",
        usage: ".stats",
        adminOnly: true,
        async execute(sock, msg, args, db, helpers) {
            const stats = await db.getStats();
            const totalUsers = stats.totalUsers || 0;
            const bannedUsers = stats.bannedUsers || 0;
            const uptime = helpers.formatTime(Date.now() - (stats.botStartTime || global.botStartTime || Date.now()));
            const startFormatted = stats.botStartTime ? moment(stats.botStartTime).format('DD/MM/YYYY HH:mm') : 'Unavailable';

            return `📊 *BOT STATISTICS*\n\n` +
                   `👥 Total Users: ${totalUsers}\n` +
                   `🔴 Banned Users: ${bannedUsers}\n` +
                   `⚡ Total Commands: ${stats.totalCommands || 0}\n` +
                   `⏱️ Uptime: ${uptime}\n` +
                   `📅 Started: ${startFormatted}`;
        }
    },

    // ✅ Execute System Command
    exec: {
        description: "Execute system command (dangerous)",
        usage: ".exec <command>",
        ownerOnly: true,
        async execute(sock, msg, args) {
            const jid = msg.key.participant || msg.key.remoteJid;
            if (jid !== getOwner()) return "⛔ Only the owner can execute commands.";

            const command = args.join(' ');
            return new Promise((resolve) => {
                exec(command, (err, stdout, stderr) => {
                    if (err) return resolve(`❌ Error:\n${err.message}`);
                    if (stderr) return resolve(`⚠️ Warning:\n${stderr}`);
                    return resolve(`✅ Output:\n${stdout || 'Command executed successfully'}`);
                });
            });
        }
    },

    // ✅ Add Admin
    addadmin: {
        description: "Add a new admin",
        usage: ".addadmin @user",
        ownerOnly: true,
        async execute(sock, msg, args, db, helpers) {
            const jid = msg.key.participant || msg.key.remoteJid;
            if (jid !== getOwner()) return "⛔ Only the owner can add admins.";

            const mention = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            if (!mention) return "❌ Mention a user to make admin!";

            const number = helpers.extractNumber(mention);
            if (config.admins.includes(number)) {
                return `⚠️ @${number} is already an admin.`;
            }

            config.admins.push(number);
            await db.saveUser(number, { isAdmin: true, adminSince: Date.now() });
            return `✅ @${number} is now an admin.`;
        }
    }
};

module.exports = adminCommands;
