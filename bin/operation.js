const path = require('path');
const spawn = require('cross-spawn');
const rm = require('rimraf');

const utils = require('./utils');

module.exports = (action, argv) => {
  // console.log(action, argv);
  // const projectName = argv.name;

  // start webpack
  let extraConfig
  let shell;
  if (action === 'dev') {
    shell = 'webpack-dev-server'
    extraConfig = [
      // '--inline',
      '--progress',
      '--config', 'build/webpack.dev.conf.js'
    ].concat(argv._.slice(1));
  } else if (action === 'build') {
    shell = 'webpack'
    extraConfig = [
      '--progress',
      '--config', 'build/webpack.prod.conf.js'
    ].concat(argv._.slice(1));
    const prodPath = path.resolve(__dirname, '../dist')
    utils.info(`delete old dist file ${prodPath}\n`)
    rm.sync(prodPath, { glob: false })
  }

  utils.info(`shell: ${shell} ${extraConfig.join(' ')}`);
  utils.info('running shell...\n');

  const workerWebpack = spawn(
    shell,
    extraConfig,
    {
      stdio: 'inherit',
      env: {
        ...process.env,
      },
    }
  );

  workerWebpack
    .on('close', (code) => {
      console.log(`子进程退出码：${code}`);
      if (code === 0) {
        process.exit(0)
      }
    });
};
