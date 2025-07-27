 // index.js main
require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode');
const fs = require('fs');
const cors = require('cors');

const cache = {};

const adminCommands = require('./commands/admin');
const allCommands = { ...require('./commands'), ...adminCommands };
const db = require('./config/db');
const helpers = require('./config/helpers');
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let botOwner = '';
const activeSessions = {};
const config = {
  botName: "JamiiBot",
  ownerNumber: "255629712678",
  prefix: ".",
  sessionName: "whatsapp-bot",
  admins: []
};

function setOwner(number) {
  const data = { owner: number };
  fs.writeFileSync(path.join(__dirname, 'owner.json'), JSON.stringify(data));
  config.ownerNumber = number;
  console.log(`✅ Owner set to ${number}`);
}

function getOwner() {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'owner.json')));
    return data.owner;
  } catch {
    return config.ownerNumber;
  }
}
config.ownerNumber = getOwner();

function formatRobotResponse(text) {
  const robotSymbols = ['🤖', '⚡', '🔧', '💻', '🛠️', '⚙️', '🎯', '🎮', '📱', '🚀'];
  const randomSymbol = robotSymbols[Math.floor(Math.random() * robotSymbols.length)];
  const header = `╔═══════════════════════╗\n║ ${randomSymbol} ${config.botName} ${randomSymbol} ║\n╚═══════════════════════╝\n\n`;
  text = typeof text === 'string' ? text : String(text || '');
  let formattedText = text.replace(/\n/g, '\n🔸 ')
                          .replace(/•/g, '⚡')
                          .replace(/\*/g, '💫')
                          .replace(/✅/g, '🜚')
                          .replace(/❌/g, '🔴');
  const footer = `\n\n╭─────────────────────┋\n│ 🤖 SPONSORED BY NYUMBACHAP    │\n│ ⚡ RESPONSE TIME: ${Date.now() % 1000}ms │\n╰─────────────────────╯`;
  return `${header}🔸 ${formattedText}${footer}`;
}

function addTechVibes(text) {
  const prefixes = ['```SYSTEM OUTPUT```', '```PROCESSING```', '```AI_RESPONSE```', '```BOT_PROTOCOL```'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const binary = Array.from({ length: 20 }, () => Math.random() > 0.5 ? '1' : '0').join('');
  return `${prefix}\n🔢 ${binary}\n\n${text}\n\n⏱️ ${new Date().toISOString()}\n🔋 STATUS: OPERATIONAL`;
}

function getMessageText(msg) {
  if (msg.conversation) return msg.conversation;
  if (msg.extendedTextMessage?.text) return msg.extendedTextMessage.text;
  if (msg.imageMessage?.caption) return msg.imageMessage.caption;
  if (msg.videoMessage?.caption) return msg.videoMessage.caption;
  return '';
}

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('join-session', (sessionId) => {
    socket.join(sessionId);
    const session = activeSessions[sessionId];
    if (session?.qr) {
      socket.emit('qr-update', { qr: session.qr, sessionId });
    }
  });
  socket.on('get_stats', sendStatsUpdate);
  socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
});

app.post('/api/start-session', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || !phone.match(/^255\d{9}$/)) return res.status(400).json({ error: 'Invalid phone number. Use 255xxxxxxxxx' });
    const sessionId = `session_${Date.now()}_${phone}`;
    await initializeWhatsAppSession(phone, sessionId);
    res.json({ success: true, sessionId });
  } catch (error) {
    console.error('Error starting session:', error);
    res.status(500).json({ error: error.message });
  }
});

async function initializeWhatsAppSession(phone, sessionId) {
  const sessionDir = path.join(__dirname, 'sessions', sessionId);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const sock = makeWASocket({ auth: state, logger: pino({ level: 'silent' }), browser: ['TechBot', 'Chrome', '1.0.0'] });
  activeSessions[sessionId] = { sock, phone };
  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      const qrDataUrl = await qrcode.toDataURL(qr);
      activeSessions[sessionId].qr = qrDataUrl;
      io.to(sessionId).emit('qr-update', { qr: qrDataUrl, sessionId });
    }
    if (connection === 'open') {
      console.log(`✅ Connected: ${phone}`);
      io.to(sessionId).emit('connection-status', { connected: true, sessionId });
      try {
        const jid = `${phone}@s.whatsapp.net`;
        setOwner(phone);
        await db.saveUser(jid, { is_admin: true });
        await sendWelcomeMessage(sock, phone);
      } catch (e) {
        console.error('DB or message error:', e);
      }
    }
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        console.log(`🔄 Reconnecting: ${phone}`);
        setTimeout(() => initializeWhatsAppSession(phone, sessionId), 5000);
      } else {
        console.log(`❌ Session ended: ${sessionId}`);
        delete activeSessions[sessionId];
        io.to(sessionId).emit('connection-status', { connected: false, sessionId });
      }
    }
  });

  initializeMessageHandler(sock);
}

function initializeMessageHandler(sock) {
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;
    const from = msg.key.remoteJid;
    const text = getMessageText(msg.message);
    if (!text.startsWith(config.prefix)) return;

    const command = text.slice(config.prefix.length).trim().split(/\s+/)[0].toLowerCase();
    const args = text.slice(config.prefix.length + command.length).trim().split(/\s+/);

    let response;
    let success = true;

    try {
      const isOwner = from === `${getOwner()}@s.whatsapp.net`;
      const isAdmin = await db.isAdmin(from);

      

      if (allCommands[command]) {
        const result = await allCommands[command].execute(sock, msg, args, db, helpers);
        if (typeof result === 'string') {
          await sock.sendMessage(from, { text: formatRobotResponse(result) }, { quoted: msg });
        } else if (typeof result === 'object' && result.text) {
          await sock.sendMessage(from, {
            text: formatRobotResponse(result.text),
            mentions: result.mentions || []
          }, { quoted: msg });
        }
        response = result.text || result;
      } else {
        response = `❌ Unknown command: *${command}*`;
      }
    } catch (e) {
      console.error('Command error:', e);
      response = `❌ ${e.message}`;
      success = false;
    }

    await db.logCommand(from, command, args, success);
    sendStatsUpdate();
  });
// Global cache ya ujumbe
const messageCache = new Map();

// Kuhifadhi ujumbe mpya
sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
        if (!msg.key.fromMe && msg.message) {
            const key = `${msg.key.remoteJid}:${msg.key.id}`;
            messageCache.set(key, msg);
        }
    }
});

// Kuangalia kama ujumbe umefutwa
sock.ev.on('messages.update', async updates => {
    for (const update of updates) {
        const key = `${update.key.remoteJid}:${update.key.id}`;
        const deletedMsg = messageCache.get(key);
        if (!deletedMsg || deletedMsg.key.fromMe) continue;

        if (update.update?.status === 'revoked') {
            const jid = deletedMsg.key.remoteJid;
            const isGroup = jid.endsWith('@g.us');
            const senderJid = deletedMsg.key.participant || jid;

            const { data, error } = await db.supabase
                .from('antidelete_settings')
                .select('*')
                .eq('user_jid', senderJid)
                .maybeSingle();

            if (error || !data?.is_enabled) return;

            // Pata content ya ujumbe uliokuwa umefutwa
            const msgContent = deletedMsg.message?.conversation
                || deletedMsg.message?.extendedTextMessage?.text
                || '[Unsupported or Media Message]';

            const target = isGroup ? jid : senderJid;

            await sock.sendMessage(target, {
                text: `🗑️ *Deleted Message Recovered:*\n${msgContent}`
            });
        }
    }
});

}

async function sendWelcomeMessage(sock, phone) {
  const welcome = `🤖 *${config.botName}* is now active!\n\n` +
                  `🔹 *Prefix:* ${config.prefix}\n` +
                  `🔹 *Owner:* ${getOwner()}\n` +
                  `🔹 *Version:* 2.0\n\n` +
                  `Type *${config.prefix}help* to see commands.`;
  await sock.sendMessage(`${phone}@s.whatsapp.net`, {
    text: addTechVibes(formatRobotResponse(welcome))
  });
}

async function sendStatsUpdate() {
  try {
    const stats = await db.getStats();
    const uptime = Math.floor((Date.now() - global.botStartTime) / 1000);
    const { data: recent } = await db.supabase
      .from('command_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10);

    io.emit('message', {
      type: 'stats',
      data: {
        totalUsers: stats.totalUsers,
        activeUsers: stats.activeUsers,
        totalCommands: stats.totalCommands,
        uptime
      }
    });

    io.emit('message', {
      type: 'activity',
      data: recent || []
    });
  } catch (e) {
    console.error('Stats error:', e);
  }
}

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  db.saveUser(`${getOwner()}@s.whatsapp.net`, { is_admin: true })
    .catch(err => console.error('Owner setup failed:', err));
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down...');
  Object.values(activeSessions).forEach(({ sock }) => sock.ws.close());
  process.exit(0);
});
