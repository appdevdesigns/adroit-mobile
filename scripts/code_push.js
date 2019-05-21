/* eslint-disable camelcase */
/* eslint-disable no-console */
const chalk = require('chalk');
const { exec } = require('child_process');
const argv = require('minimist')(process.argv.slice(2));
const { version } = require('../package.json');
const util = require('./util');

const EXIT_CODE = {
  RELEASE_FAILED: 1,
  HISTORY_FAILED: 2,
};

const { os, environment } = argv;
const plist = os === 'ios' ? '--plist-file ios/adroit/Info.plist' : '';

const help = `
Creates a code push release and tags the current git commit with the release number

node ./scripts/code_push.js
  -h --help
  --os           Either android or ios
  --environment  Either Staging or Production
`;

// ############################################################################
// Validate the arguments

util.required(os, 'os', help);
util.required(environment, 'env', help);

util.validateEnvironment(environment, help);
util.validateOS(os, help);

/**
 *  Fetch the corresponding Code Push deployment history and get the latest release version number.
 */
function getHistory() {
  const historyCmd = `appcenter codepush deployment history -a DigiServe/adroit-${os} ${environment} --output="json"`;

  console.log(chalk.cyan(historyCmd));

  exec(historyCmd, (error, stdout, stderr) => {
    try {
      if (error) {
        throw error;
      }
      const history = JSON.parse(stdout);
      // eslint-disable-next-line prefer-destructuring
      const latestCodePushVersion = history[history.length - 1][0];
      const tagName = `code-push-${os}-${environment}-${latestCodePushVersion}`;
      const message = `Code Push release (${os}/${environment})`;
      util.gitTag(tagName, message);
    } catch (err) {
      console.log(
        chalk.red(
          'Failed to fetch latest Code Push version. Please manually call the git tag command to tag this commit with the Code Push release version just created.'
        )
      );
      console.log(chalk.red(err));
      if (stderr) {
        console.log(chalk.red(stderr));
      }
      process.exit(EXIT_CODE.HISTORY_FAILED);
    }
  });
}

/**
 *  Create the Code Push release using the AppCenter CLI
 */
function createCodePushRelease() {
  const releaseCmd = `appcenter codepush release-react -a DigiServe/adroit-${os} -d ${environment} -t "${version}" ${plist}`;

  console.log(chalk.cyan(releaseCmd));

  exec(releaseCmd, (error, stdout, stderr) => {
    if (error) {
      console.log(chalk.red('Failed to create code push release'));
      console.log(chalk.red(error));
      console.log(chalk.red(stderr));
      process.exit(EXIT_CODE.RELEASE_FAILED);
    }
    getHistory();
  });
}

createCodePushRelease();
