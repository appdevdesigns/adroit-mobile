import { AsyncStorage } from 'react-native';
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
    console.error('Error retrieving CSRF token', err);
  }

  if (csrfToken) {
    // console.log('Using CSRF token', csrfToken);
    requestHeaders.set('X-CSRF-Token', csrfToken);
  } else {
    // console.warn('CSRF token was empty');
  }

  const absoluteUrl = Api.urls.base + url;

  console.log('fetchJson', options);

  return fetch(absoluteUrl, { ...options, headers: requestHeaders })
    .then(response =>
      response.text().then(text => ({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        body: text,
      }))
    )
    .then(async ({ status, statusText, headers, body }) => {
      console.log(`${url} returned`, status, statusText, headers, body);
      let json;
      try {
        json = JSON.parse(body);
      } catch (e) {
        // not json, no big deal
        console.log('Body is not a well formatted Json');
      }
      if (status === 401) {
        await AsyncStorage.removeItem('adroit_csrf');
        // TODO: redirect to Login page
      }
      if (status < 200 || status >= 300) {
        const errorMessage = (json && json.message) || statusText;
        console.log('fetch failed', status, errorMessage);
        return Promise.reject(new HttpError(errorMessage, status, json));
      }
      return { status, headers, body, json };
    });
};

export default fetchJson;
