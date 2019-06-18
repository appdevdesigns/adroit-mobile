import OneSignal from 'react-native-onesignal';
import Config from 'react-native-config';
import { Platform } from 'react-native';
import Monitoring from 'src/util/Monitoring';

// Ignore notifications for now on Android as there's an issue with dependencies
const notificationsDisabled = Platform.OS === 'android';

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
  init: () => {
    if (notificationsDisabled) {
      Monitoring.debug('Notifications.init() skipped');
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
    if (notificationsDisabled) {
      Monitoring.debug('Notifications.setAuthUser() skipped');
      return;
    }
    try {
      OneSignal.setExternalUserId(String(user.id));
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
    if (notificationsDisabled) {
      Monitoring.debug('Notifications.checkStatus() skipped');
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
