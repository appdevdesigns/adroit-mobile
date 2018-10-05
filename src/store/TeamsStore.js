import { observable, action, runInAction, reaction } from 'mobx';
import { Toast } from 'native-base';
import fetchJson from 'src/util/fetch';
import Api from 'src/util/api';

export default class TeamsStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
    reaction(
      () => this.rootStore.auth.isLoggedIn,
      isLoggedIn => {
        if (isLoggedIn) {
          this.listUserTeams();
        }
      }
    );
  }

  @observable
  fetchCount = 0;

  @observable
  latestError = null;

  @observable
  list: [];

  @action.bound
  listUserTeams() {
    console.log('listUserTeams');
    this.fetchCount += 1;
    fetchJson(Api.urls.listUserTeams, {
      method: 'GET',
    })
      .then(userTeamsResponse => {
        console.log('listUserTeams response', userTeamsResponse);
        const teamList = userTeamsResponse.json.data;
        runInAction(() => {
          this.list = teamList;
          this.fetchCount = Math.max(this.fetchCount - 1, 0);
        });
        teamList.forEach(team => {
          this.rootStore.users.getTeamMembers(team.IDMinistry);
          this.rootStore.teamActivities.getTeamActivities(team);
        });
      })
      .catch(error => {
        Toast.show({ text: error.message, type: 'danger', buttonText: 'OKAY' });
        runInAction(() => {
          this.list = [];
          this.latestError = error;
          this.fetchCount = Math.max(this.fetchCount - 1, 0);
        });
      });
  }
}
