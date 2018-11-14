import { Sentry } from 'react-native-sentry';
import packageJson from 'package.json';

const Monitoring = {
  init: () => {
    if (!__DEV__) {
      Sentry.config('https://a0015892e6a04614b45b14e4af767922@sentry.io/1321081', {
        release: packageJson.version,
      }).install();
    }
  },

  captureException: (error, extra = {}) => {
    Sentry.captureException(error, { extra });
  },

  captureMessage: (message, extra = {}) => {
    Sentry.captureMessage(message, { extra });
  },

  log: (message, ...args) => {
    console.log(message, ...args);
  },
};

export default Monitoring;
