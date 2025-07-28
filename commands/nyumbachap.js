//commands/nyumbachap.js
module.exports = {
    // Command kuu ya NyumbaChap
    "nyumbachap": {
        description: "🏠 Angalia huduma zote zinazotolewa na NyumbaChap",
        usage: ".nyumbachap",
        isSubcommand: false,
        async execute(sock, msg, args) {
            const menu = `
╭───❖「 *NyumbaChap* 」❖───╮
│🏠 *Huduma Zinazopatikana:*
│
│📌 .nyumbachap-ajira - Nafasi za kazi
│📌 .nyumbachap-offer - Ofa za nyumba
│📌 .nyumbachap-contact - Wasiliana nasi
│📌 .nyumbachap-maoni - Tuma maoni yako
│📌 .nyumbachap-jisajili - Jisajili kama mteja
│📌 .nyumbachap-list - Orodha ya nyumba zote
│📌 .nyumbachap-map <jina> - Nyumba kulingana na eneo
│📌 .nyumbachap-news - Makala za uhamasishaji
│📌 .nyumbachap-help - Maswali Yanayoulizwa Sana (FAQ)
│📌 .nyumbachap-agent - Maelezo kuhusu kuwa wakala
╰────────────────────╯
`;
            await sock.sendMessage(msg.key.remoteJid, { text: menu }, { quoted: msg });
        }
    },

    // Subcommands
    "nyumbachap-ajira": {
        description: "🧑‍💼 Angalia nafasi za kazi zinazopatikana",
        usage: ".nyumbachap-ajira",
        isSubcommand: true,
        async execute(sock, msg, args) {
            const content = `
📌 *Nafasi za Kazi NyumbaChap:*

1. 💼 Developer wa Backend (Django)
2. 📲 Frontend Designer (React / Tailwind)
3. 🎨 UI/UX Designer
4. 📢 Afisa Masoko (Digital Marketing)
5. 🏢 Wakala wa Nyumba (Kila Mkoa)

👉 Tuma wasifu (CV) kupitia: support@nyumbachap.com
            `;
            await sock.sendMessage(msg.key.remoteJid, { text: content }, { quoted: msg });
        }
    },

    "nyumbachap-offer": {
        description: "💸 Ofa za sasa za nyumba",
        usage: ".nyumbachap-offer",
        isSubcommand: true,
        async execute(sock, msg, args) {
            const content = `
🏷️ *Ofa za Nyumba (Julai 2025)*

🏡 Mbezi Beach — Tsh 150k (Ofa: Tsh 100k)
🏘️ Kigamboni — Tsh 75k (Ofa: Tsh 68k)
🏠 Tabata — Tsh 45k (Ofa: Tsh 40k)

📲 Tembelea: https://nyumbachap.com
            `;
            await sock.sendMessage(msg.key.remoteJid, { text: content }, { quoted: msg });
        }
    },

    "nyumbachap-contact": {
        description: "📞 Wasiliana na timu ya NyumbaChap",
        usage: ".nyumbachap-contact",
        isSubcommand: true,
        async execute(sock, msg, args) {
            const contact = `
📞 *Mawasiliano ya NyumbaChap*:

📍 Ofisi: Kinondoni, Dar es Salaam  
📧 Email: support@nyumbachap.com  
📱 Simu: 0629712678  
🌍 Website: https://nyumbachap.com
            `;
            await sock.sendMessage(msg.key.remoteJid, { text: contact }, { quoted: msg });
        }
    },

    "nyumbachap-maoni": {
        description: "📝 Tuma maoni au mrejesho kuhusu huduma zetu",
        usage: ".nyumbachap-maoni",
        isSubcommand: true,
        async execute(sock, msg, args) {
            const response = `
📝 *Tutumie Maoni Yako*  
👉 Tembelea:  https://wa.me/255750910158  
Au tuma ujumbe wako moja kwa moja hapa.
            `;
            await sock.sendMessage(msg.key.remoteJid, { text: response }, { quoted: msg });
        }
    },

    "nyumbachap-jisajili": {
        description: "🧾 Jisajili kama mteja wa NyumbaChap",
        usage: ".nyumbachap-jisajili",
        isSubcommand: true,
        async execute(sock, msg, args) {
            const text = `
📋 *Fomu ya Usajili*  
Jaza taarifa zako kupitia:  
🌐 https://www.base.nyumbachap.com/Register 
            `;
            await sock.sendMessage(msg.key.remoteJid, { text: text }, { quoted: msg });
        }
    },

    "nyumbachap-list": {
        description: "🏠 Orodha ya nyumba zote zinazopatikana",
        usage: ".nyumbachap-list",
        isSubcommand: true,
        async execute(sock, msg, args) {
            const listings = `
🏘️ *Nyumba Zinazopatikana kwa Sasa:*

1. 📍 Mikocheni — 3BR, Tsh 80k
2. 📍 Bunju — 2BR, Tsh 65k
3. 📍 Tegeta — 4BR, Tsh 180k

Zaidi: https://www.base.nyumbachap.com/property_list/
            `;
            await sock.sendMessage(msg.key.remoteJid, { text: listings }, { quoted: msg });
        }
    },

    "nyumbachap-map": {
        description: "📍 Tafuta nyumba kwa kutumia jina la eneo",
        usage: ".nyumbachap-map <eneo>",
        isSubcommand: true,
        async execute(sock, msg, args) {
            if (!args.length) {
                return await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Tafadhali andika jina la eneo mfano: `.nyumbachap-map tegeta`" }, { quoted: msg });
            }

            const eneo = args.join(" ").toLowerCase();
            const text = `
🔍 *Matokeo ya eneo: ${eneo.charAt(0).toUpperCase() + eneo.slice(1)}*  
(Tafsiri ya mfano tu)

1. 🏠 ${eneo} House 1 — 3BR, Tsh 90k  
2. 🏡 ${eneo} House 2 — 4BR, Tsh 135k

👉 Angalia zaidi: https://www.base.nyumbachap.com/search_property/?q=${eneo}
            `;
            await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
        }
    },

    "nyumbachap-news": {
        description: "📚 Makala za elimu kuhusu ununuzi wa nyumba",
        usage: ".nyumbachap-news",
        isSubcommand: true,
        async execute(sock, msg, args) {
            const articles = `
📚 *Makala za NyumbaChap:*

1. ✅ Jinsi ya kuandaa hati halali ya umiliki
2. 💡 Vidokezo vya kuchagua eneo bora
3. 📊 Athari za soko la nyumba Tanzania

Soma zaidi: https://www.base.nyumbachap.com/Blog
            `;
            await sock.sendMessage(msg.key.remoteJid, { text: articles }, { quoted: msg });
        }
    },

    "nyumbachap-help": {
        description: "❓ Maswali yanayoulizwa mara kwa mara",
        usage: ".nyumbachap-help",
        isSubcommand: true,
        async execute(sock, msg, args) {
            const faq = `
❓ *Maswali Yanayoulizwa Sana:*

Q: Je, ninawezaje kununua nyumba?
A: Tembelea tovuti yetu na chagua nyumba kisha wasiliana nasi.

Q: Je, ninawezaje kuhariri tangazo la chumba nilichoweka kama mwenyeji?
A: Ili kuhariri tangazo lako, ingia kwenye akaunti yako, nenda kwenye “Dashboard”, na chagua chumba unachotaka kuhariri. Huko utaweza kubadilisha maelezo yoyote, picha, au bei.

Q: Ninawezaje kusajili nyumba yangu kwenye mfumo NyumbaChap??
A: Ili kusajili nyumba NyumbaChap, tembelea https://nyumbachap.com/ na ingia kwenye akaunti yako. Ikiwa huna akaunti, jiandikishe kwanza kupitia https://nyumbachap.com/Register/. Baada ya kuingia, nenda kwenye sehemu ya kuongeza mali kwa kubofya https://nyumbachap.com/add_property/ kisha jaza taarifa muhimu kuhusu nyumba yako kama eneo, idadi ya vyumba, bei, na maelezo mengine. Hakikisha umejaza kila kitu sahihi kisha bofya "Tuma" au "Sajili" ili kukamilisha mchakato..

Q: Nifanye nini kama chumba nilichobook hakilingani na maelezo au picha??
A: Ikiwa chumba ulichopewa hakilingani na maelezo au picha, tafadhali wasiliana nasi mara moja kupitia support@nyumbachap.com au sehemu ya msaada ya haraka kwenye tovuti. Tafadhali piga picha za uthibitisho na eleza tofauti uliyokutana nayo. 
Tutachunguza suala hilo na kuchukua hatua, ikiwa ni pamoja na kurejesha pesa zako au kusaidia kupata malazi mbadala..

📘 Zaidi: https://www.base.nyumbachap.com/help/
            `;
            await sock.sendMessage(msg.key.remoteJid, { text: faq }, { quoted: msg });
        }
    },

    "nyumbachap-ajent": {
        description: "🤝 Jua jinsi ya kuwa wakala wa kuuza nyumba kupitia NyumbaChap",
        usage: ".nyumbachap-ajent",
        isSubcommand: true,
        async execute(sock, msg, args) {
            const wakala = `
🤝 *Kuwa Wakala wa NyumbaChap*  

Unapata:
✅ Kamisheni hadi 30%
✅ Mafunzo na msaada
✅ Dashboard ya kufuatilia mauzo
✅ Unalipwa 500 kila nyumba uliyosajili inapo tazamwa
✅ Mshahara wa Tsh. 60000/= ukisajili nyumba 15 tu kwa mwezi


📝 Jisajili: https://nyumbachap.com
            `;
            await sock.sendMessage(msg.key.remoteJid, { text: wakala }, { quoted: msg });
        }
    }
};
