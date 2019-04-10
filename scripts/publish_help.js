const { deploy } = require('sftp-sync-deploy');

const config = {
  host: process.env.ADROIT_HELP_FTP_HOST,
  port: process.env.ADROIT_HELP_FTP_PORT || 22,
  username: process.env.ADROIT_HELP_FTP_USERNAME,
  password: process.env.ADROIT_HELP_FTP_PASSWORD,
  localDir: './public',
  remoteDir: '/home/public_html/adroit',
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
