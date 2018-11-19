import { observable, action, runInAction, reaction } from 'mobx';
import { persist } from 'mobx-persist';
import { Sentry } from 'react-native-sentry';
import { Toast } from 'native-base';
import fetchJson from 'src/util/fetch';
import Monitoring from 'src/util/Monitoring';
import Api from 'src/util/api';
import ResourceStore from './ResourceStore';

export default class UsersStore extends ResourceStore {
  constructor(rootStore) {
    super(rootStore, 'IDPerson', true);
    reaction(
      () => this.rootStore.auth.isLoggedIn,
      isLoggedIn => {
        if (isLoggedIn) {
          this.getAuthenticatedUser();
        }
      }
    );
  }

  @persist('object')
  @observable
  me = {
    id: null,
    displayName: null,
  };

  @action.bound
  clear() {
    this.me = {
      id: null,
      displayName: null,
    };
    super.clear();
  }

  @action.bound
  clearMe() {
    this.me = {
      id: null,
      displayName: null,
    };
  }

  @action.bound
  getAuthenticatedUser() {
    console.log('getAuthenticatedUser');
    const url = Api.urls.whoami;
    const options = { method: 'GET' };
    fetchJson(url, options)
      .then(whoAmIResponse => {
        console.log('getAuthenticatedUser response', whoAmIResponse);
        const me = whoAmIResponse.json.data;
        Sentry.setUserContext({
          username: this.rootStore.auth.username,
          userID: String(me.IDPerson),
        });
        runInAction(() => {
          this.me = {
            id: me.IDPerson,
            displayName: me.display_name,
          };
        });
      })
      .catch(async error => {
        runInAction(() => {
          this.me = {
            id: null,
            displayName: null,
          };
        });
        if (error.status === 401) {
          await this.onUnauthorised();
        } else {
          Toast.show({ text: error.message, type: 'danger', buttonText: 'OKAY' });
          Monitoring.exception(error, { problem: 'API request failed', url, options });
        }
      });
  }
}
