import { observable, action, runInAction, reaction } from 'mobx';
import { persist } from 'mobx-persist';
import { Toast } from 'native-base';
import fetchJson from 'src/util/fetch';
import Api from 'src/util/api';
import ResourceStore from './ResourceStore';

export default class UsersStore extends ResourceStore {
  constructor(rootStore) {
    super(rootStore, 'IDPerson');
    reaction(
      () => this.rootStore.auth.isLoggedIn,
      isLoggedIn => {
        if (isLoggedIn) {
          this.getAuthenticatedUser();
        } else {
          this.clearMe();
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
  clearMe() {
    this.me = {
      id: null,
      displayName: null,
    };
  }

  @action.bound
  getAuthenticatedUser() {
    console.log('getAuthenticatedUser');
    fetchJson(Api.urls.whoami, { method: 'GET' })
      .then(whoAmIResponse => {
        console.log('getAuthenticatedUser response', whoAmIResponse);
        runInAction(() => {
          this.me = {
            id: whoAmIResponse.json.data.IDPerson,
            displayName: whoAmIResponse.json.data.display_name,
          };
        });
      })
      .catch(async error => {
        Toast.show({ text: error.message, type: 'danger', buttonText: 'OKAY' });
        runInAction(() => {
          this.me = {
            id: null,
            displayName: null,
          };
        });
        if (error.status === 401) {
          await this.onUnauthorised();
        }
      });
  }
}
