import forIn from 'lodash-es/forIn';
import { AsyncStorage } from 'react-native';
import Monitoring from 'src/util/Monitoring';
import Constants from 'src/util/Constants';
import Api from './api';

const xhr = async (url, options) => {
  let csrfToken;
  try {
    csrfToken = await AsyncStorage.getItem('adroit_csrf');
  } catch (err) {
    Monitoring.error('Error retrieving CSRF token', err);
  }

  const req = new XMLHttpRequest();
  req.open(options.method || 'POST', Api.absoluteUrl(url));
  req.timeout = Constants.networkRequestTimeoutMs;
  forIn(options.headers || {}, (value, key) => {
    req.setRequestHeader(key, value);
  });

  if (csrfToken) {
    req.setRequestHeader('X-CSRF-Token', csrfToken);
  } else {
    Monitoring.debug('CSRF token in AsyncStorage was empty');
  }

  if (options.onProgress) {
    req.upload.addEventListener(
      'progress',
      e => {
        Monitoring.debug('XHR request progress', e);
        options.onProgress(e);
      },
      false
    );
  }
  if (options.onReadyStateChange) {
    req.onreadystatechange = options.onReadyStateChange;
  }
  if (options.onLoad) {
    req.onload = response => {
      Monitoring.debug(`XHR response: ${url}`, response.currentTarget.response);
      if (response.currentTarget.status < 200 || response.currentTarget.status >= 300) {
        if (options.onError) {
          options.onError(response.currentTarget.status);
        } else {
          Monitoring.error('XHR request failed but no onError handler provided', {
            url,
            options,
            response: response.currentTarget,
          });
        }
      } else {
        options.onLoad(response);
      }
    };
  }
  if (options.onError) {
    req.onerror = options.onError;
  }
  req.ontimeout = () => {
    Monitoring.error(`XHR request to ${url} timed out`);
    if (options.onError) {
      options.onError();
    }
  };
  Monitoring.debug(`XHR request: ${url}`, options);
  req.send(options.body);
};

export default xhr;
