import { Toast } from 'native-base';
import defaults from 'lodash-es/defaults';
import Copy from 'src/assets/Copy';
import Constants from 'src/util/Constants';
import Monitoring from 'src/util/Monitoring';

const defaultToastArgs = {
  duration: Constants.defaultToastDurationMs,
  buttonText: Copy.toast.okButtonText,
};

const showSafeToast = (...args) => {
  try {
    Toast.show(...args);
  } catch (err) {
    Monitoring.error('Exception caught while displaying toast', ...args);
  }
};

const AdroitToast = {
  danger: (text, ...args) => {
    const toastArgs = defaults(...args, {
      text,
      type: 'danger',
      ...defaultToastArgs,
    });
    showSafeToast(toastArgs);
  },

  warning: (text, ...args) => {
    const toastArgs = defaults(...args, {
      text,
      type: 'warning',
      ...defaultToastArgs,
    });
    showSafeToast(toastArgs);
  },

  success: (text, ...args) => {
    const toastArgs = defaults(...args, {
      text,
      type: 'success',
      ...defaultToastArgs,
    });
    showSafeToast(toastArgs);
  },
};

export default AdroitToast;
