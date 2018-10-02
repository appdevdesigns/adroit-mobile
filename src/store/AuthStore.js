import { AsyncStorage } from 'react-native';
import { observable, computed, action } from 'mobx';
import fetchJson from '../util/fetch';

export const AuthStatus = {
  LoggingIn: 'LoggingIn',
  Authenticated: 'Authenticated',
  AuthenticationFailed: 'AuthenticationFailed',
  LoggedOut: 'LoggedOut',
};

export default class AuthStore {
  @observable
  status = AuthStatus.LoggedOut;

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

  @observable
  user = {
    id: null,
    displayName: null,
  };

  @action.bound
  login(username, password) {
    this.status = AuthStatus.LoggingIn;
    fetchJson('/csrfToken', { method: 'GET' })
      .then(async csrfResponse => {
        await AsyncStorage.setItem('adroit_csrf', csrfResponse.json._csrf); // eslint-disable-line
        fetchJson('/site/login', {
          method: 'POST',
          body: JSON.stringify({
            username,
            password,
          }),
        })
          .then(async loginResponse => {
            await AsyncStorage.setItem('adroit_username', username);
            await AsyncStorage.setItem('adroit_password', password);
            this.onLoggedIn(loginResponse.json);
          })
          .catch(this.onLoginFailed);
      })
      .catch(this.onLoginFailed);
  }

  @action.bound
  async logout() {
    await AsyncStorage.removeItem('adroit_csrf');
    await AsyncStorage.removeItem('adroit_password');
    this.onLoggedOut();
  }

  @action.bound
  onLoggedIn() {
    this.status = AuthStatus.Authenticated;
  }

  @action.bound
  onLoginFailed() {
    this.status = AuthStatus.AuthenticationFailed;
  }

  @action.bound
  onLoggedOut() {
    this.status = AuthStatus.LoggedOut;
    console.log('Logged out');
  }
}
