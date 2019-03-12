/* eslint-disable camelcase */
/* eslint-disable no-console */
const chalk = require('chalk');
const { exec } = require('child_process');
const argv = require('minimist')(process.argv.slice(2));

const EXIT_CODE = {
  MISSING_PARAM: 1,
  INVALID_ENV: 2,
  INVALID_OS: 3,
  RELEASE_FAILED: 4,
  HISTORY_FAILED: 5,
  TAG_FAILED: 6,
  PUSH_FAILED: 7,
};

const { os, environment, version } = argv;
const plist = os === 'ios' ? '--plist-file ios/adroit/Info.plist' : '';

const help = `
Creates a code push release and tags the current git commit with the release number

node ./srcripts/code_push.js
  -h --help
  --os           Either android or ios
  --version      The target version number
  --environment  Either Staging or Production
`;

// ############################################################################
// Validate the arguments

function required(param, paramName) {
  if (!paramName) {
    console.log(chalk.red(`${paramName} not provided`));
    console.log(help);
    process.exit(EXIT_CODE.MISSING_PARAM);
  }
}

required(version, 'version');
required(os, 'os');
required(environment, 'env');

if (!['Staging', 'Production'].includes(environment)) {
  console.log(chalk.red(`env must be either 'Staging' or 'Production'`));
  console.log(help);
  process.exit(EXIT_CODE.INVALID_ENV);
}

if (!['android', 'ios'].includes(os)) {
  console.log(chalk.red(`os must be either 'android' or 'ios'`));
  console.log(help);
  process.exit(EXIT_CODE.INVALID_OS);
}

/**
 * Executes a git push
 */
function gitPush() {
  const pushCmd = 'git push';

  console.log(chalk.cyan(pushCmd));

  exec(pushCmd, (error, stdout, stderr) => {
    if (error) {
      console.log(chalk.red('Failed to push tag change'));
      console.log(chalk.red(error));
      console.log(chalk.red(stderr));
      process.exit(EXIT_CODE.PUSH_FAILED);
    }
  });
}

/**
 * Tag the current git commit with the Code Push release version
 */
function gitTag(latestCodePushVersion) {
  const tagCmd = `git tag -a code-push-${latestCodePushVersion}`;

  console.log(chalk.cyan(tagCmd));

  exec(tagCmd, (error, stdout, stderr) => {
    if (error) {
      console.log(chalk.red('Failed to create git tag'));
      console.log(chalk.red(error));
      console.log(chalk.red(stderr));
      process.exit(EXIT_CODE.TAG_FAILED);
    }
    gitPush();
  });
}

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
      gitTag(latestCodePushVersion);
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
