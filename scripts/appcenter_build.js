/* eslint-disable camelcase */
/* eslint-disable no-console */
const chalk = require('chalk');
const { exec } = require('child_process');
const argv = require('minimist')(process.argv.slice(2));
const util = require('./util');

const EXIT_CODE = {
  BUILD_QUEUE_FAILED: 1,
};

const { os } = argv;

const help = `
Enqueues an App Center build for the specified project

node ./srcripts/appcenter_build.js
  -h --help
  --os           Either android or ios
  --branch       Branch name (optional)
`;

// ############################################################################
// Validate the arguments

util.required(os, 'os');
util.validateOS(os, help);

const branch = argv.branch || 'master';

/**
 *  Enqueue an App Center build using the AppCenter CLI
 */
function enqueueBuild() {
  const buildCmd = `appcenter build queue -a DigiServe/adroit-${os} -b ${branch}`;

  console.log(chalk.cyan(buildCmd));

  exec(buildCmd, (error, stdout, stderr) => {
    if (error) {
      console.log(chalk.red('Failed to enqueue App Center build'));
      console.log(chalk.red(error));
      console.log(chalk.red(stderr));
      process.exit(EXIT_CODE.BUILD_QUEUE_FAILED);
    }
    console.log('Done!');
  });
}

enqueueBuild();
