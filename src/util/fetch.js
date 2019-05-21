import AsyncStorage from '@react-native-community/async-storage';
import Monitoring from 'src/util/Monitoring';
import HttpError from './HttpError';
import Api from './api';

const fetchJson = async (url, options = {}) => {
  const requestHeaders =
    options.headers ||
    new Headers({
      Accept: 'application/json',
    });
  if (!(options && options.body && options.body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  let csrfToken;
  try {
    csrfToken = await AsyncStorage.getItem('adroit_csrf');
  } catch (err) {
    Monitoring.error('Error retrieving CSRF token', err);
  }

  if (csrfToken) {
    requestHeaders.set('X-CSRF-Token', csrfToken);
  } else {
    Monitoring.debug('CSRF token in AsyncStorage was empty');
  }

  const absoluteUrl = Api.urls.base + url;

  Monitoring.debug('fetchJson', url, options, requestHeaders);

  return fetch(absoluteUrl, { ...options, credentials: 'include', headers: requestHeaders })
    .then(response =>
      response.text().then(text => ({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        body: text,
      }))
    )
    .then(async response => {
      const { status, statusText, headers, body } = response;
      Monitoring.debug(`${url} returned`, response, status, statusText, headers, body);
      let json;
      try {
        json = JSON.parse(body);
      } catch (e) {
        // not json, no big deal
        Monitoring.debug(`${url} response: body is not a well-formatted JSON object`);
      }
      if (status < 200 || status >= 300) {
        const errorMessage = (json && json.message) || statusText;
        // Don't send failed login attempts to Sentry!
        if (status === 400 && url.endsWith(Api.urls.login)) {
          Monitoring.debug(errorMessage, json);
        } else if (status !== 401) {
          Monitoring.error('fetch failed', status, errorMessage, json);
        }
        return Promise.reject(new HttpError(errorMessage, status, json));
      }
      return { status, headers, body, json };
    });
  // .catch(error => {
  //   console.log('Fetch Error:', error);
  //   return Promise.reject(new HttpError(error.message, 0, {}));
  // });
};

export default fetchJson;
