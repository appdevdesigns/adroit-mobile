/* eslint-disable no-console */
const chalk = require('chalk');
const { exec } = require('child_process');

const EXIT_CODE = {
  MISSING_PARAM: -1,
  INVALID_ENV: -2,
  INVALID_OS: -3,
  TAG_FAILED: -4,
  PUSH_FAILED: -5,
};

function required(param, paramName, help) {
  if (!param) {
    console.log(chalk.red(`${paramName} not provided`));
    console.log(help);
    process.exit(EXIT_CODE.MISSING_PARAM);
  }
}

function validateOS(os, help) {
  if (!['android', 'ios'].includes(os)) {
    console.log(chalk.red(`os must be either 'android' or 'ios'`));
    console.log(help);
    process.exit(EXIT_CODE.INVALID_OS);
  }
}

function validateEnvironment(environment, help) {
  if (!['Staging', 'Production'].includes(environment)) {
    console.log(chalk.red(`env must be either 'Staging' or 'Production'`));
    console.log(help);
    process.exit(EXIT_CODE.INVALID_ENV);
  }
}

/**
 * Executes a git push - optionally for a tag
 */
function gitPush(tagName) {
  const pushCmd = tagName ? `git push origin ${tagName}` : 'git push';

  console.log(chalk.cyan(pushCmd));

  exec(pushCmd, (error, stdout, stderr) => {
    if (error) {
      console.log(chalk.red('Failed to execute git push'));
      console.log(chalk.red(error));
      console.log(chalk.red(stderr));
      process.exit(EXIT_CODE.PUSH_FAILED);
    }
  });
}

/**
 * Tag the current git commit with the specified tag and message. The tag is then pushed to origin.
 */
function gitTag(tagName, message) {
  const tagCmd = `git tag -m "${message}" -a ${tagName}`;

  console.log(chalk.cyan(tagCmd));

  exec(tagCmd, (error, stdout, stderr) => {
    if (error) {
      console.log(chalk.red('Failed to create git tag'));
      console.log(chalk.red(error));
      console.log(chalk.red(stderr));
      process.exit(EXIT_CODE.TAG_FAILED);
    }
    gitPush(tagName);
  });
}

module.exports = {
  required,
  validateOS,
  validateEnvironment,
  gitTag,
  gitPush,
};
