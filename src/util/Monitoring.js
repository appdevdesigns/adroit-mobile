import { Sentry } from 'react-native-sentry';
import Countly from 'countly-sdk-react-native';
import Config from 'react-native-config';
import packageJson from 'package.json';

export const Event = {
  ActivityPhotoUploadSuccess: 'activity-photo-upload-success',
  ActivityPhotoUploadFail: 'activity-photo-upload-fail',
};

const consoleLog = (...args) => {
  if (__DEV__) {
    /* eslint-disable no-console */
    console.log(...args);
    /* eslint-enable no-console */
  }
};

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
    Sentry.config('https://a0015892e6a04614b45b14e4af767922@sentry.io/1321081', {
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
