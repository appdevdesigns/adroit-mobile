import { action, reaction } from 'mobx';
import Api from 'src/util/api';
import ResourceStore from './ResourceStore';

export default class TeamsStore extends ResourceStore {
  constructor(rootStore) {
    super(rootStore, 'IDMinistry');
    reaction(
      () => this.rootStore.auth.isLoggedIn,
      isLoggedIn => {
        if (isLoggedIn) {
          this.listUserTeams();
        }
      }
    );
  }

  @action.bound
  listUserTeams() {
    console.log('listUserTeams');
    this.fetchList(Api.urls.listUserTeams);
  }

  @action.bound
  onFetchListSuccess(list) {
    list.forEach(team => {
      this.rootStore.users.getTeamMembers(team.IDMinistry);
      this.rootStore.teamActivities.getTeamActivities(team);
    });
  }
}
