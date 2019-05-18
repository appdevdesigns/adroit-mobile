import { observable, action, runInAction, reaction } from 'mobx';
import { persist } from 'mobx-persist';
import Copy from 'src/assets/Copy';
import fetchJson from 'src/util/fetch';
import Monitoring from 'src/util/Monitoring';
import Toast from 'src/util/Toast';
import Api from 'src/util/api';
import ResourceStore from './ResourceStore';

const emptyUser = () => ({
  id: null,
  displayName: null,
});

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
  me = emptyUser();

  @action.bound
  clear() {
    this.me = emptyUser();
    super.clear();
  }

  @action.bound
  clearMe() {
    this.me = emptyUser();
  }

  @action.bound
  getAuthenticatedUser() {
    const url = Api.urls.whoami;
    const options = { method: 'GET' };
    fetchJson(url, options)
      .then(whoAmIResponse => {
        const me = whoAmIResponse.json.data;
        Monitoring.setUserContext({
          name: me.display_name,
          userId: String(me.IDPerson),
          username: this.rootStore.auth.username,
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
          this.me = emptyUser();
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
