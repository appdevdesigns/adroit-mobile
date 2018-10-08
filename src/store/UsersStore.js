import { observable, action, runInAction, reaction } from 'mobx';
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
        }
      }
    );
  }

  @observable
  me = {
    id: null,
    displayName: null,
  };

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

  @action.bound
  getTeamMembers(teamId) {
    console.log('getTeamMembers', teamId);
    this.fetchList(Api.urls.teamMembers(teamId));
  }
}
