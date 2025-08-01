// module.exports = {
//   name: "welcomeGoodbye",
//   description: "Karibu na kwa heri kwa member wapya au waliotoka",
  
//   async handler(sock) {
//     sock.ev.on("group-participants.update", async (update) => {
//       const { id, participants, action } = update;

//       for (let participant of participants) {
//         let ppUrl;
//         try {
//           ppUrl = await sock.profilePictureUrl(participant, "image");
//         } catch {
//           ppUrl = "https://i.ibb.co/sqz0FyB/default.jpg"; // fallback
//         }

//         let name = participant.split("@")[0];

//         if (action === "add") {
//           const message = {
//             image: { url: ppUrl },
//             caption: `👋 Karibu sana *@${name}* kwenye kundi letu! Tunafurahi kukuona hapa.\n\nTafadhali soma sheria za group 📜 na uwe huru kuchangia.`,
//             mentions: [participant]
//           };
//           await sock.sendMessage(id, message);
//         } else if (action === "remove") {
//           const message = {
//             image: { url: ppUrl },
//             caption: `😢 Tutaendelea kukukumbuka *@${name}*. Ulikuwa sehemu muhimu ya group letu.\n\nKwa heri na kila la heri!`,
//             mentions: [participant]
//           };
//           await sock.sendMessage(id, message);
//         }
//       }
//     });
//   }
// };
