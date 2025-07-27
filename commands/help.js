const helpCommands = {
    help: {
        description: "Onyesha orodha ya commands zote",
        usage: ".help",
        execute: async (sock, msg, args, db, helpers) => {
            // Get all commands from the loaded commands object
            const allCommands = require('./index');

            let helpText = "🛠️ *Orodha ya Commands* 🛠️\n\n";

            for (const cmd in allCommands) {
                const { description, usage } = allCommands[cmd];
                helpText += `• *${usage}* - ${description}\n`;
            }

            return helpText;
        }
    }
};

module.exports = helpCommands;
