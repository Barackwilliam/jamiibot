const bot = {
  description: "📣 Maelekezo ya jinsi ya kujisajili na kutufuatilia",
  usage: ".bot",
  adminOnly: false,
  ownerOnly: false,
  execute: async (sock, msg, args) => {
    const promotionText = `*🤖 Karibu JamiiBot!*\n\n` +
      `📝 *Jinsi ya Kujisajili:*\n` +
      `Gusa link hii na ujisajili haraka kupitia tovuti yetu:\n` +
      `🔗 https://jamii-bot-b15b.onrender.com\n\n` +
      `🌍 Bot hii imeundwa kwa ajili ya kukuunganisha na teknolojia, kukupa taarifa muhimu, kujifunza skills mpya, na kusaidia jamii ya tech Tanzania.\n\n` +
      `🏠 *Pia angalia NyumbaChap! Moja kwa moja Kupitia Command*  Andika *.nyumbachap* kutafuta nyumba, ofa za bei nafuu, au mawakala waliothibitishwa kutoka maeneo mbalimbali Tanzania. Tunaiweka nchi yetu digitali kwa vitendo!\n\n` +
      `📢 *UNAIPENDA COMPUTER SCIENCE AU IT?* 👨‍💻👩‍💻\nJiunge na channel yetu rasmi ya WhatsApp ya *Computer Science & IT Tanzania* ambapo tunatoa:\n• Mafunzo ya bure\n• Msaada wa kitaalamu\n• Fursa za kazi na ujuzi\n• Mitandao ya tech professionals nchini\n\n👉 Gusa hapa kujiunga:\nhttps://whatsapp.com/channel/0029VaExlbt6rsQlSlptDW0e\n\n` +
      `Tunaijenga Tanzania ya kiteknolojia! 🇹🇿💻\n\n_Tumia .help kuona commands zingine._`;

    await sock.sendMessage(msg.key.remoteJid, {
      text: promotionText
    }, { quoted: msg });

    return;
  }
};

module.exports = { bot };
