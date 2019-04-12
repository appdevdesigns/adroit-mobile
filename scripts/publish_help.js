const { deploy } = require('sftp-sync-deploy');

const config = {
  host: process.env.APPDEVDESIGNS_FTP_HOST,
  port: 22,
  username: process.env.APPDEVDESIGNS_FTP_USERNAME,
  privateKey: process.env.APPDEVDESIGNS_FTP_KEY,
  localDir: './public',
  remoteDir: '/data/www/nodejs/live/adroit/assets/help',
};

const options = {
  dryRun: false, // Enable dry-run mode. Default to false
  exclude: [], // exclude patterns (glob)
  excludeMode: 'remove', // Behavior for excluded files ('remove' or 'ignore'), Default to 'remove'.
  forceUpload: false, // Force uploading all files, Default to false(upload only newer files).
};

deploy(config, options)
  .then(() => {
    console.log('success!');
  })
  .catch(err => {
    console.error('error! ', err);
  });
