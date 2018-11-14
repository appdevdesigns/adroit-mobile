import { AsyncStorage } from 'react-native';
import { observable, computed, action } from 'mobx';
import * as Keychain from 'react-native-keychain';
import { Toast } from 'native-base';
import parse from 'date-fns/parse';
import isAfter from 'date-fns/is_after';
import addHours from 'date-fns/add_hours';
import fetchJson from 'src/util/fetch';
import Api from 'src/util/api';

const SESSION_LENGTH_HRS = 2;

export const AuthStatus = {
  Pending: 'Pending',
  LoggingIn: 'LoggingIn',
  Authenticated: 'Authenticated',
  AuthenticationFailed: 'AuthenticationFailed',
  LoggedOut: 'LoggedOut',
};

export default class AuthStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable
  status = AuthStatus.Pending;

  @observable
  username = undefined;

  @computed
  get isLoggedIn() {
    return this.status === AuthStatus.Authenticated;
  }

  @computed
  get isLoggedOut() {
    return this.status === AuthStatus.LoggedOut;
  }

  @computed
  get loginFailed() {
    return this.status === AuthStatus.AuthenticationFailed;
  }

  static async getLastLogin() {
    const lastLoginTimestampStr = await AsyncStorage.getItem('adroit_last_login');
    return lastLoginTimestampStr ? parse(parseInt(lastLoginTimestampStr, 10)) : null;
  }

  static async setLastLogin(date = new Date()) {
    await AsyncStorage.setItem('adroit_last_login', String(date.getTime()));
  }

  static async cacheCredentials(username, password) {
    return Keychain.setGenericPassword(username, password);
  }

  static async getCachedCredentials() {
    try {
      return Keychain.getGenericPassword();
    } catch (error) {
      console.log('Failed to access keychain');
    }
    return { username: undefined, password: undefined };
  }

  static async resetCachedCredentials() {
    return Keychain.resetGenericPassword();
  }

  async checkSession() {
    const csrfToken = await AsyncStorage.getItem('adroit_csrf');
    if (!csrfToken) {
      console.log('Session not open: No CSRF token');
      this.logout();
      return false;
    }
    const lastLogin = await AuthStore.getLastLogin();
    if (!lastLogin) {
      console.log('Session not open: Last Login time not found');
      this.logout();
      return false;
    }
    const nowTimestamp = new Date().getTime();
    const expectedSessionExpiration = addHours(lastLogin, SESSION_LENGTH_HRS);
    if (isAfter(nowTimestamp, expectedSessionExpiration)) {
      console.log('Session not open: assumed expired');
      this.logout();
      return false;
    }
    return true;
  }

  @action.bound
  login(username, password) {
    this.status = AuthStatus.LoggingIn;
    fetchJson(Api.urls.csrfToken, { method: 'GET' })
      .then(async csrfResponse => {
        await AsyncStorage.setItem('adroit_csrf', csrfResponse.json._csrf); // eslint-disable-line
        fetchJson(Api.urls.login, {
          method: 'POST',
          body: JSON.stringify({
            username,
            password,
          }),
        })
          .then(async () => {
            await AuthStore.cacheCredentials(username, password);
            await AuthStore.setLastLogin();
            this.onLoggedIn(username);
          })
          .catch(this.onLoginFailed);
      })
      .catch(this.onLoginFailed);
  }

  @action.bound
  async logout() {
    this.username = undefined;
    await AuthStore.resetCachedCredentials();
    await AsyncStorage.removeItem('adroit_csrf');
    this.onLoggedOut();
  }

  @action.bound
  onLoggedIn(username) {
    this.username = username;
    this.status = AuthStatus.Authenticated;
  }

  @action.bound
  onLoginFailed(error) {
    Toast.show({ text: error.message, type: 'danger', buttonText: 'OKAY' });
    this.status = AuthStatus.AuthenticationFailed;
  }

  @action.bound
  onLoggedOut() {
    this.status = AuthStatus.LoggedOut;
  }
}
