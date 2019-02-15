import OneSignal from 'react-native-onesignal';
import Config from 'react-native-config';
import Monitoring from 'src/util/Monitoring';

// Ref: https://documentation.onesignal.com/v5.0/docs/react-native-sdk#section-ios-initialization-parameters
const NotificationConfig = {
  kOSSettingsKeyAutoPrompt: true,
  kOSSettingsKeyInFocusDisplayOption: 1,
};

const Notifications = {
  init: () => {
    if (Config.ONESIGNAL_APP_ID) {
      OneSignal.init(Config.ONESIGNAL_APP_ID, NotificationConfig);
    } else {
      Monitoring.error(`ONESIGNAL_APP_ID environment variable not set`);
    }
    if (__DEV__) {
      OneSignal.setLogLevel(5, 1);
    }
  },

  setUserId: userId => {
    OneSignal.setExternalUserId(userId.toString());
  },
};

export default Notifications;
