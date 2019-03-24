const chalk = require('chalk');
const fs = require('fs-extra');

exports.info = (content) => {
  console.log(chalk.blue(content))
}
exports.warn = (content) => {
  console.log(chalk.yellow(content))
}
exports.error = (content) => {
  console.log(chalk.bold.red(content))
}

exports.getConfig = (configPath) => {
  let config
  try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  } catch (e) {
    module.exports.error(`config format error: ${e.message}`)
  }
  return config
};
