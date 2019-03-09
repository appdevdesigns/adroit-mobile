/* eslint-disable no-console */
const chalk = require('chalk');
const { exec } = require('child_process');
const argv = require('minimist')(process.argv.slice(2));

const EXIT_CODE = {
  NO_VERSION: 1,
  RELEASE_FAILED: 2,
  HISTORY_FAILED: 3,
  TAG_FAILED: 4,
};

const os = argv.o || argv.os || 'android';
const environment = argv.e || argv.env || 'Staging';
const version = argv.t || argv.target_version;
const plist = os === 'ios' ? '--plist-file ios/adroit/Info.plist' : '';

const help = `
Creates a code push release and tags the current git commit with the release number

node ./srcripts/code_push.js
  -h --help
  -o --os              Either android or ios
  -t --target-version  The target version number
  -e --env             Either Staging or Production
`;

if (!version) {
  console.log(chalk.red('Version number not provided'));
  console.log(help);
  process.exit(EXIT_CODE.NO_VERSION);
}

// ############################################################################
// 1. Create the Code Push release using the AppCenter CLI

const releaseCmd = `codepush release-react -a DigiServe/adroit-${os} -d ${environment} -t "${version}" ${plist}`;

console.log(chalk.cyan(releaseCmd));

exec(releaseCmd, (error, stdout, stderr) => {
  if (error) {
    console.log(chalk.red('Failed to create code push release'));
    console.log(chalk.red(stderr));
    process.exit(EXIT_CODE.RELEASE_FAILED);
  }
});

// ############################################################################
// 2. Fetch the corresponding Code Push deployment history and get the latest release version number.

let latestCodePushVersion;

const historyCmd = `appcenter codepush deployment history -a DigiServe/adroit-${os} ${environment} --output="json"`;

console.log(chalk.cyan(historyCmd));

exec(historyCmd, (error, stdout, stderr) => {
  try {
    if (error) {
      throw error;
    }
    const history = JSON.parse(stdout);
    // eslint-disable-next-line prefer-destructuring
    latestCodePushVersion = history[history.length - 1][0];
  } catch (err) {
    console.log(
      chalk.red(
        'Failed to fetch latest Code Push version. Please manually call the git tag command to tag this commit with the Code Push release version just created.'
      )
    );
    if (stderr) {
      console.log(chalk.red(stderr));
    }
    process.exit(EXIT_CODE.HISTORY_FAILED);
  }
});

// ############################################################################
// 3. Tag the current git commit with the Code Push release version

const tagCmd = `git tag -a code-push-${latestCodePushVersion}`;

console.log(chalk.cyan(tagCmd));

exec(tagCmd, (error, stdout, stderr) => {
  if (error) {
    console.log(chalk.red('Failed to create git tag'));
    console.log(chalk.red(stderr));
    process.exit(EXIT_CODE.TAG_FAILED);
  }
});
