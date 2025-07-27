const kick = {
  description: "Fukuza mtu/matatu kutoka group (admin tu)",
  usage: ".kick 2556xxxxxxxx [2556yyyyyyyy] ...",
  adminOnly: true,
  ownerOnly: false, // Admin tu wanaruhusiwa
  execute: async (sock, msg, args) => {
    const from = msg.key.remoteJid;

    // 1. Check kama ni group
    if (!from.endsWith('@g.us')) {
      return '❌ Command hii inaweza kutumika tu kwenye group.';
    }

    // 2. Check kama kuna args
    if (args.length === 0) {
      return '❌ Tafadhali taja namba moja au zaidi kwa format 255xxxxxxxxx';
    }

    // 3. Check kama bot ni admin
    const groupMetadata = await sock.groupMetadata(from);
    const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const botIsAdmin = groupMetadata.participants.some(p => p.id === botNumber && p.admin !== null);
    if (!botIsAdmin) {
      return '❌ Sitaki kuondoa mtu kama mimi sio admin kwenye group hii.';
    }

    // 4. Check kama user ni admin au owner
    const sender = msg.key.participant || msg.key.remoteJid;
    const userIsAdmin = groupMetadata.participants.some(p => p.id === sender && p.admin !== null);
    const isOwner = sender === `${process.env.OWNER_NUMBER}@s.whatsapp.net` || sender === `${process.env.OWNER_NUMBER}@s.whatsapp.net`;

    if (!userIsAdmin && !isOwner) {
      return '❌ Huna ruhusa ya kutumia command hii. (Admin tu)';
    }

    // 5. Prepare list ya namba zitatakiwa kufukuzwa
    const toRemove = args.map(num => num.replace(/[^0-9]/g, '') + '@s.whatsapp.net');

    // 6. Kick mtu mmoja mmoja
    let successList = [];
    let failList = [];

    for (const jid of toRemove) {
      try {
        // Kama mtu si member, skip
        const isMember = groupMetadata.participants.some(p => p.id === jid);
        if (!isMember) {
          failList.push(jid.split('@')[0]);
          continue;
        }

        await sock.groupParticipantsUpdate(from, [jid], 'remove');
        successList.push(jid.split('@')[0]);
      } catch (err) {
        failList.push(jid.split('@')[0]);
        console.error('Kick error:', err);
      }
    }

    // 7. Return result message
    let response = '';

    if (successList.length > 0) {
      response += `✅ Namba hizi zimeondolewa kwenye group:\n${successList.map(n => `- ${n}`).join('\n')}\n`;
    }
    if (failList.length > 0) {
      response += `❌ Hatuwezi kuondoa namba hizi (sio members au error):\n${failList.map(n => `- ${n}`).join('\n')}`;
    }

    return response || '❌ Hakuna mtu aliyeondolewa.';
  }
};

module.exports = { kick };
