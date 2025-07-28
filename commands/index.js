// commands/index.js
// const fs = require("fs");
// const path = require("path");
// const allCommands = {};

// const antideleteCommand = require('./antidelete');
// const adminCommands = require('./admin');
// Object.assign(allCommands, adminCommands);
// Object.assign(allCommands, antideleteCommand);


// const commandsDir = __dirname;
// fs.readdirSync(commandsDir).forEach((file) => {
//   if (file !== "index.js" && file.endsWith(".js")) {
//     const commandSet = require(path.join(commandsDir, file));
//     Object.assign(allCommands, commandSet);
//   }
// });

// module.exports = allCommands;


// commands/index.js
const fs = require("fs");
const path = require("path");

const allCommands = {};

const commandsDir = __dirname;

fs.readdirSync(commandsDir).forEach((file) => {
  if (file !== "index.js" && file.endsWith(".js")) {
    const commandSet = require(path.join(commandsDir, file));
    Object.assign(allCommands, commandSet);
  }
});

module.exports = allCommands;

