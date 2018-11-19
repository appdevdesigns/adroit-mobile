import { Sentry } from 'react-native-sentry';
import Config from 'react-native-config';
import packageJson from 'package.json';

/* eslint-disable no-console */
const DebugMonitoring = {
  init: () => {
    console.log('Initializing debug monitoring');
  },

  debug: (message, ...args) => {
    console.log(message, ...args);
  },

  info: (message, ...args) => {
    console.log(message, ...args);
  },

  notice: (message, ...args) => {
    console.log(message, ...args);
  },

  warn: (message, ...args) => {
    console.log(message, ...args);
  },

  error: (message, ...args) => {
    console.log(message, ...args);
  },

  exception: (error, ...args) => {
    console.log(error, ...args);
  },

  critical: (message, ...args) => {
    console.log(message, ...args);
  },

  alert: (message, ...args) => {
    console.log(message, ...args);
  },

  emergency: (message, ...args) => {
    console.log(message, ...args);
  },
};

const Monitoring = {
  init: () => {
    Sentry.config('https://a0015892e6a04614b45b14e4af767922@sentry.io/1321081', {
      release: packageJson.version,
    }).install();
    // log.setConfig({
    //   host: Config.GRAYLOG_HOST,
    //   fields: {
    //     log_source: 'adroit-mobile',
    //   },
    //   filter: [
    //     message => message.level < 7, // rejects a "debug" message
    //   ],
    // });
    // if (Config.GRAYLOG_HOST === 'TBD') {
    //   Sentry.captureMessage('GRAYLOG_HOST environment variable not set');
    // }
  },

  debug: (message, ...args) => {
    // log.debug(message, ...args);
    console.log(message, ...args);
  },

  info: (message, ...args) => {
    // log.info(message, ...args);
    console.log(message, ...args);
  },

  notice: (message, ...args) => {
    // log.notice(message, ...args);
    console.log(message, ...args);
  },

  warn: (message, ...args) => {
    // log.warn(message, ...args);
    console.log(message, ...args);
  },

  error: (message, ...args) => {
    // log.error(message, ...args);
    console.log(message, ...args);
    Sentry.captureMessage(message, { extra: args });
  },

  exception: (error, ...args) => {
    // log.error(error, ...args);
    console.log(error, ...args);
    Sentry.captureException(error, { extra: args });
  },

  critical: (message, ...args) => {
    // log.critical(message, ...args);
    console.log(message, ...args);
    Sentry.captureMessage(message, { extra: args });
  },

  alert: (message, ...args) => {
    // log.alert(message, ...args);
    console.log(message, ...args);
    Sentry.captureMessage(message, { extra: args });
  },

  emergency: (message, ...args) => {
    // log.emergency(message, ...args);
    console.log(message, ...args);
    Sentry.captureMessage(message, { extra: args });
  },
};

const useRemoteTools = Config.FORCE_REMOTE_MONITORING === 'true' || !__DEV__;

export default (useRemoteTools ? Monitoring : DebugMonitoring);
/* eslint-enable no-console */
