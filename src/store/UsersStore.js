import { observable, action, runInAction, reaction } from 'mobx';
import { persist } from 'mobx-persist';
import Copy from 'src/assets/Copy';
import fetchJson from 'src/util/fetch';
import Monitoring from 'src/util/Monitoring';
import Notifications from 'src/util/Notifications';
import Toast from 'src/util/Toast';
import Api from 'src/util/api';
import ResourceStore from './ResourceStore';

const emptyUser = {
  id: null,
  displayName: null,
  username: null,
};

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
  me = emptyUser;

  @action.bound
  clear() {
    this.clearMe();
    super.clear();
  }

  @action.bound
  clearMe() {
    this.me = emptyUser;
  }

  @action.bound
  getAuthenticatedUser() {
    const url = Api.urls.whoami;
    const options = { method: 'GET' };
    fetchJson(url, options)
      .then(whoAmIResponse => {
        const me = whoAmIResponse.json.data;
        const authUser = {
          id: me.IDPerson,
          displayName: me.display_name,
          username: this.rootStore.auth.username,
        };
        Monitoring.setUserContext(authUser);
        Notifications.setAuthUser(authUser);
        runInAction(() => {
          this.me = authUser;
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
