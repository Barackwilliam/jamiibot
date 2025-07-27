// commands/index.js
const adminCommands = require('./admin');

const allCommands = {};

Object.assign(allCommands, adminCommands);

module.exports = allCommands;

const fs = require("fs");
const path = require("path");
Object.assign(allCommands, adminCommands);


const commandsDir = __dirname;
fs.readdirSync(commandsDir).forEach((file) => {
  if (file !== "index.js" && file.endsWith(".js")) {
    const commandSet = require(path.join(commandsDir, file));
    Object.assign(allCommands, commandSet);
  }
});

module.exports = allCommands;
