import { Sentry } from 'react-native-sentry';
import Countly from 'countly-sdk-react-native';
import Config from 'react-native-config';
import packageJson from 'package.json';

export const Event = {
  ActivityPhotoUploadSuccess: 'activity-photo-upload-success',
  ActivityPhotoUploadFail: 'activity-photo-upload-fail',
};

/* eslint-disable no-console */
const consoleLog = (...args) => {
  if (__DEV__) {
    console.log(...args);
  }
};

const verifyConfigIsSet = configKey => {
  if (!Config[configKey]) {
    console.error(`${configKey} environment variable not set`);
  }
};
/* eslint-enable no-console */

const DebugMonitoring = {
  init: () => {
    consoleLog('Initializing debug monitoring');
  },

  debug: (message, ...args) => {
    consoleLog(message, ...args);
  },

  event: (eventKey, data) => {
    consoleLog(eventKey, data);
  },

  screenView: screenName => {
    consoleLog(`Viewing page ${screenName}`);
  },

  error: (message, ...args) => {
    consoleLog(message, ...args);
  },

  exception: (error, ...args) => {
    consoleLog(error, ...args);
  },
};

const Monitoring = {
  init: () => {
    verifyConfigIsSet('SENTRY_ENDPOINT');
    verifyConfigIsSet('COUNTLY_HOST');
    verifyConfigIsSet('COUNTLY_APP_KEY');
    Sentry.config(Config.SENTRY_ENDPOINT, {
      release: packageJson.version,
    }).install();
    Countly.begin(Config.COUNTLY_HOST, Config.COUNTLY_APP_KEY)
      .then(result => {
        consoleLog('Initialized Countly analytics', result);
      })
      .catch(err => {
        consoleLog('Failed to initialize Countly analytics', err);
      });
  },

  debug: (message, ...args) => {
    consoleLog(message, ...args);
  },

  event: (eventKey, data) => {
    consoleLog(eventKey, data);
    const event = { key: eventKey, count: 1, segmentation: data };
    Countly.recordEvent(event);
  },

  screenView: screenName => {
    Countly.recordView(screenName);
  },

  error: (message, ...args) => {
    consoleLog(message, ...args);
    Sentry.captureMessage(message, { extra: { ...args } });
  },

  exception: (error, ...args) => {
    consoleLog(error, ...args);
    Sentry.captureException(error, { extra: { ...args } });
  },
};

const useRemoteTools = Config.FORCE_REMOTE_MONITORING === 'true' || !__DEV__;

export default (useRemoteTools ? Monitoring : DebugMonitoring);
