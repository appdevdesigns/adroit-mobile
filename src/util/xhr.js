import forIn from 'lodash-es/forIn';
import { AsyncStorage } from 'react-native';
import HttpError from './HttpError';
import Api from './api';

const xhr = async (url, options) => {
  let csrfToken;
  try {
    csrfToken = await AsyncStorage.getItem('adroit_csrf');
  } catch (err) {
    console.error('Error retrieving CSRF token', err);
  }

  const req = new XMLHttpRequest();
  req.open(options.method || 'POST', Api.absoluteUrl(url));
  forIn(options.headers || {}, (value, key) => {
    req.setRequestHeader(key, value);
  });
  if (csrfToken) {
    // console.log('Using CSRF token', csrfToken);
    req.setRequestHeader('X-CSRF-Token', csrfToken);
  } else {
    // console.warn('CSRF token was empty');
  }

  if (options.onProgress) {
    req.upload.addEventListener('progress', options.onProgress, false);
  }
  if (options.onReadyStateChange) {
    req.onreadystatechange = options.onReadyStateChange;
  }
  if (options.onLoad) {
    req.onload = options.onLoad;
  }
  req.send(options.body);
};

export default xhr;
