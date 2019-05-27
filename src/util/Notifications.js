import OneSignal from 'react-native-onesignal';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import Monitoring from 'src/util/Monitoring';

// Ref: https://documentation.onesignal.com/docs/react-native-sdk#section--setloglevel-
const ONE_SIGNAL_LOG_LEVEL = {
  None: 0,
  Fatal: 1,
  Errors: 2,
  Warnings: 3,
  Info: 4,
  Debug: 5,
  Verbose: 6,
};

// Ref: https://documentation.onesignal.com/v5.0/docs/react-native-sdk#section-ios-initialization-parameters
const NotificationConfig = {
  kOSSettingsKeyAutoPrompt: true,
  kOSSettingsKeyInFocusDisplayOption: 1,
};

const Notifications = {
  // Currently Notifications are only supported on Android
  // (Until testing on iOS is complete)
  notificationsSupported: () => Platform.OS === 'android',

  init: () => {
    if (!this.notificationsSupported()) {
      Monitoring.debug('Notifications: init skipped - not supported');
      return;
    }

    const logLevels = __DEV__
      ? {
          console: ONE_SIGNAL_LOG_LEVEL.Verbose,
          dialog: ONE_SIGNAL_LOG_LEVEL.Errors,
        }
      : {
          console: ONE_SIGNAL_LOG_LEVEL.Warnings,
          dialog: ONE_SIGNAL_LOG_LEVEL.None,
        };

    if (Config.ONESIGNAL_APP_ID) {
      try {
        // First param is log level to send to iOS XCode log or Android LogCat log
        // Second param is log level to show as an alert dialog
        OneSignal.setLogLevel(logLevels.console, logLevels.dialog);

        OneSignal.init(Config.ONESIGNAL_APP_ID, NotificationConfig);
      } catch (err) {
        Monitoring.exception(err, { message: 'Failed to initialize OneSignal' });
      }
    } else {
      Monitoring.error('ONESIGNAL_APP_ID environment variable not set');
    }
  },

  setAuthUser: user => {
    if (!this.notificationsSupported()) {
      Monitoring.debug('Notifications: setAuthUser skipped - not supported');
      return;
    }
    try {
      OneSignal.setExternalUserId(String(user.IDPerson));
      OneSignal.sendTags({
        user_id: user.id,
        real_name: user.displayName,
        username: user.username,
      });
    } catch (err) {
      Monitoring.exception(err, { message: 'Failed to send auth user details to OneSignal' });
    }
  },

  checkStatus: () => {
    if (!this.notificationsSupported()) {
      Monitoring.debug('Notifications: checkStatus skipped - not supported');
      return;
    }
    try {
      OneSignal.getPermissionSubscriptionState(subscriptionState => {
        Monitoring.debug('OneSignal permission subscription state', subscriptionState);
      });
    } catch (err) {
      Monitoring.exception(err, { message: 'Failed to check OneSignal notification status' });
    }
  },
};

export default Notifications;
