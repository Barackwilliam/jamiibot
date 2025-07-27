module.exports = {
    antidelete: {
        command: ['antidelete'],
        category: 'settings',
        description: 'Turn antidelete on/off',
        async execute(sock, msg, args, db) {
            const jid = msg.key.remoteJid;
            const senderJid = msg.key.participant || msg.key.remoteJid;

            if (!args[0]) {
                await sock.sendMessage(jid, { text: '⚙️ Usage: antidelete on/off' }, { quoted: msg });
                return;
            }

            const isOn = args[0].toLowerCase() === 'on';

            const { data, error } = await db.supabase
                .from('antidelete_settings')
                .upsert(
                    { user_jid: senderJid, is_enabled: isOn, updated_at: new Date() },
                    { onConflict: ['user_jid'] }
                );

            if (error) {
                console.error('Error updating antidelete setting:', error.message);
                await sock.sendMessage(jid, { text: '❌ Failed to update setting.' }, { quoted: msg });
                return;
            }

            await sock.sendMessage(jid, {
                text: isOn
                    ? '✅ Antidelete is now *ON*. Messages will be saved before being deleted.'
                    : '🛑 Antidelete is now *OFF*. Deleted messages will be ignored.'
            }, { quoted: msg });
        }
    }
};
