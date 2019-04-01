const chalk = require("chalk");

const info = (message, ...args) => {
  console.log(chalk.blue.bold("[INFO]: " + message, args));
};

const warn = (message, ...args) => {
  console.log(chalk.yellow.bold("[WARN]: " + message, args));
};
const error = (message, ...args) => {
  console.log(chalk.red.bold("[ERROR]: " + message, args));
};

const success = (message, ...args) => {
  console.log(chalk.green.bold("[SUCCESS]: " + message, args));
};

module.exports = {
  info,
  warn,
  error,
  success
};
