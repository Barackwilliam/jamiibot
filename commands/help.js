//commands/help.js
module.exports = {
  help: {
    description: "Onyesha orodha ya commands",
    usage: ".help",
    async execute(sock, msg, args) {
      const allCommands = require('./index');

      let helpText = "🛠️ *Orodha ya Commands Kuu* 🛠️\n\n";

      for (const cmd in allCommands) {
        const { description, usage, isSubcommand } = allCommands[cmd];

        // Skip subcommands
        if (isSubcommand) continue;

        helpText += `• *${usage}* - ${description}\n`;
      }

      return helpText;
    }
  }
};


