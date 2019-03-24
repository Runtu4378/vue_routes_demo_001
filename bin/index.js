#!/usr/bin/env node

const yargs = require('yargs');
const operation = require('./operation');

const VERSION = require('../package.json').version

// init usage
yargs.usage(
  `
  cli ${VERSION}
  
  usage: cli [command] [options]
  `
);

// init yargs command
yargs.command(
  'dev',
  'start single project on dev mode',
  {
    'name': {
      type: 'string',
      desc: 'the name of the target project',
    },
  },
  (argv) => operation('dev', argv),
);

yargs.command(
  'build',
  'build single project with webpack',
  {
    'name': {
      type: 'string',
      desc: 'the name of the target project',
    },
  },
  (argv) => operation('build', argv),
);

yargs
  .help('h')
  .alias('h', 'help')
  .version('version', 'v')
  .strict()
  .epilog('copyright 2018')
  .argv;
