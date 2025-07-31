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
const axios = require('axios');

const welcomeGoodbye = require("./commands/welcomeGoodbye");
// const linkDetector = require("./commands/linkDetector");

const cache = {};
const messageCache = new Map();
const adminCommands = require('./commands/admin');
const allCommands = { ...require('./commands'), ...adminCommands };
const db = require('./config/db');
const helpers = require('./config/helpers');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
    pingInterval: 25000,
    pingTimeout: 60000,
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

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

function formatRobotResponse(text, useTemplate = false) {
    if (!useTemplate) return text;
    const techIcons = ['🤖', '⚡', '💻', '🔌', '📱', '🖥️', '🔋', '🛠️', '🧹', '📊'];
    const randomIcon = techIcons[Math.floor(Math.random() * techIcons.length)];
    const header = `╭──✨ ${randomIcon} ${config.botName} ${randomIcon} ✨ ⋅ ⋅ ─╮\n`;
    text = typeof text === 'string' ? text : String(text || '');
    let formattedText = text
        .replace(/\n/g, '\n│ ')
        .replace(/•/g, '✦')
        .replace(/\*/g, '⭑')
        .replace(/✅/g, '✓')
        .replace(/❌/g, '✗');
    const techMeter = `│ ${'▰'.repeat(2 + Math.floor(Math.random() * 2))}${'▱'.repeat(2)} JamiiBot ${'▱'.repeat(3)}\n`;
    const footer = `╰─── ⋅ ⋅ ✨ ${randomIcon} [${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}] ⋅ ⋅ ───╯\n` +
        `   ⏰ Response: ${Date.now() % 1000}ms | 📀 v2.0 | 🔗 nyumbachap.com`;
    return `${header}│ ${formattedText}\n${techMeter}${footer}`;
}

function addTechVibes(text) {
    const statuses = ['SYSTEM STATUS ACTIVE 🟢', 'BOT PROCESSING ⚙️', 'RESPONSE GENERATED 🤖', 'BOT CONNECTION ACTIVE 🌐'];
    const binaryBg = Array.from({ length: 30 }, () => Math.random() > 0.5 ? '1' : '0').join('');
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `▞▚ ${statuses[Math.floor(Math.random() * statuses.length)]}\n▚ ${binaryBg}\n\n${text}\n\n⏰ ${timestamp} | 🔋 ${Math.floor(Math.random() * 30) + 70}%`;
}

function formatHelpCommand() {
    const visibleCommands = Object.entries(allCommands).filter(([_, command]) => !command.isSubcommand).map(([name]) => config.prefix + name);
    return `📜 *Orodha ya Commands*:\n\n${visibleCommands.join('\n')}`;
}

function getMessageText(msg) {
    if (msg.conversation) return msg.conversation;
    if (msg.extendedTextMessage?.text) return msg.extendedTextMessage.text;
    if (msg.imageMessage?.caption) return msg.imageMessage.caption;
    if (msg.videoMessage?.caption) return msg.videoMessage.caption;
    return '';
}

const activeSessions = {};

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
    const sock = makeWASocket({ auth: state, logger: pino({ level: 'silent' }), browser: ['JamiiBot', 'Chrome', '1.0.0'] });
    
    // linkDetector.handler(sock);
    welcomeGoodbye.handler(sock);
   
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
                await sock.sendMessage(`${phone}@s.whatsapp.net`, {
                    text: `📣 *Ungana nasi kwa taarifa mpya, Mafunzo, na Updates ya kila wiki kupitia channel yetu rasmi ya WhatsApp:*\n\n🔗 https://whatsapp.com/channel/0029VaExlbt6rsQlSlptDW0e\n\n💡 Hakikisha ume-*Follow* ili usipitwe na fursa!`,
                });
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
        for (const msg of messages) {
            if (!msg.message) continue;
            const from = msg.key.remoteJid;
            const text = getMessageText(msg.message);

            if (!text.startsWith(config.prefix)) return;

            const command = text.slice(config.prefix.length).trim().split(/\s+/)[0].toLowerCase();
            const args = text.slice(config.prefix.length + command.length).trim().split(/\s+/);

            try {
                const isOwner = from === `${getOwner()}@s.whatsapp.net`;
                const isAdmin = await db.isAdmin(from);

                if (command === 'help') {
                    await sock.sendMessage(from, {
                        text: formatRobotResponse(formatHelpCommand(), true)
                    }, { quoted: msg });
                    return;
                }

                if (allCommands[command]) {
                    const result = await allCommands[command].execute(sock, msg, args, db, helpers);
                    const message = typeof result === 'object' ? result.text : result;
                    await sock.sendMessage(from, {
                        text: formatRobotResponse(message, false),
                        mentions: result?.mentions || []
                    }, { quoted: msg });
                } else {
                    await sock.sendMessage(from, {
                        text: formatRobotResponse(`❌ Unknown or Syntax Errror For this command: *${command}*`, false)
                    }, { quoted: msg });
                }

                await db.logCommand(from, command, args, true);
                sendStatsUpdate();
            } catch (e) {
                console.error('Command error:', e);
                await db.logCommand(from, command, args, false);
            }
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        for (const msg of messages) {
            if (!msg.key.fromMe && msg.message) {
                const key = `${msg.key.remoteJid}:${msg.key.id}`;
                messageCache.set(key, msg);
            }
        }
    });

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

                const msgContent = deletedMsg.message?.conversation ||
                    deletedMsg.message?.extendedTextMessage?.text ||
                    '[Unsupported or Media Message]';

                await sock.sendMessage(isGroup ? jid : senderJid, {
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
        text: addTechVibes(formatRobotResponse(welcome, true))
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
global.botStartTime = Date.now();

httpServer.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    db.saveUser(`${getOwner()}@s.whatsapp.net`, { is_admin: true })
        .catch(err => console.error('Owner setup failed:', err));
});

// ===== Self-ping function to keep Render free plan alive =====
function startSelfPing() {
    // Hii URL inatokana na env au localhost:PORT/health
    const url = process.env.APP_URL || `http://localhost:${PORT}/health`;

    setInterval(async () => {
        try {
            const response = await axios.get(url);
            if (response.status === 200) {
                console.log(`✅ Self-ping success at ${new Date().toISOString()}`);
            } else {
                console.log(`⚠️ Self-ping failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error('❌ Self-ping error:', error.message);
        }
    }, 270000); // 4.5 minutes interval
}

// Anza self-ping baada ya server kuanza kusikiliza
startSelfPing();

process.on('SIGINT', () => {
    console.log('\n👋 Shutting down...');
    Object.values(activeSessions).forEach(({ sock }) => sock.ws.close());
    process.exit(0);
});
