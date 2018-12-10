import { observable, action, runInAction, reaction } from 'mobx';
import { persist } from 'mobx-persist';
import { Sentry } from 'react-native-sentry';
import Copy from 'src/assets/Copy';
import fetchJson from 'src/util/fetch';
import Monitoring from 'src/util/Monitoring';
import Toast from 'src/util/Toast';
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
    const url = Api.urls.whoami;
    const options = { method: 'GET' };
    fetchJson(url, options)
      .then(whoAmIResponse => {
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
          Toast.danger(Copy.toast.genericError);
          Monitoring.exception(error, { problem: 'API request failed', url, options });
        }
      });
  }
}
