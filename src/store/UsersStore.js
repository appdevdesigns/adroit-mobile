import { observable, action, runInAction, reaction } from 'mobx';
import { Toast } from 'native-base';
import keyBy from 'lodash-es/keyBy';
import fetchJson from 'src/util/fetch';
import Api from 'src/util/api';

export default class UsersStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
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

  @observable
  fetchCount = 0;

  @observable
  latestError = null;

  @observable
  map = new Map();

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
      .catch(error => {
        Toast.show({ text: error.message, type: 'danger', buttonText: 'OKAY' });
        runInAction(() => {
          this.me = {
            id: null,
            displayName: null,
          };
        });
      });
  }

  @action.bound
  getTeamMembers(teamId) {
    console.log('getTeamMembers', teamId);
    this.fetchCount += 1;
    fetchJson(Api.urls.teamMembers(teamId), {
      method: 'GET',
    })
      .then(response => {
        console.log('getTeamMembers response', response);
        const usersMap = keyBy(response.json.data, user => user.id);
        runInAction(() => {
          this.map.merge(usersMap);
          this.fetchCount = Math.max(this.fetchCount - 1, 0);
        });
      })
      .catch(error => {
        console.log('getTeamMembers error', error);
        Toast.show({ text: error.message, type: 'danger', buttonText: 'OKAY' });
        runInAction(() => {
          this.map.clear();
          this.latestError = error;
          this.fetchCount = Math.max(this.fetchCount - 1, 0);
        });
      });
  }
}
