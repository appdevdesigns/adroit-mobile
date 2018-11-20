import { Toast } from 'native-base';
import defaults from 'lodash-es/defaults';
import Copy from 'src/assets/Copy';
import Constants from 'src/util/Constants';

const defaultToastArgs = {
  duration: Constants.defaultToastDurationMs,
  buttonText: Copy.toast.okButtonText,
};

const AdroitToast = {
  danger: (text, ...args) => {
    const toastArgs = defaults(...args, {
      text,
      type: 'danger',
      ...defaultToastArgs,
    });
    Toast.show(toastArgs);
  },

  warning: (text, ...args) => {
    const toastArgs = defaults(...args, {
      text,
      type: 'warning',
      ...defaultToastArgs,
    });
    Toast.show(toastArgs);
  },

  success: (text, ...args) => {
    const toastArgs = defaults(...args, {
      text,
      type: 'success',
      ...defaultToastArgs,
    });
    Toast.show(toastArgs);
  },
};

export default AdroitToast;
