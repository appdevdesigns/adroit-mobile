import { action, reaction } from 'mobx';
import sortBy from 'lodash-es/sortBy';
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

  getTeamMembers(teamId) {
    if (teamId) {
      const team = this.map.get(String(teamId));
      if (team.memberIds) {
        return sortBy(team.memberIds.map(id => this.rootStore.users.map.get(String(id))), ['display_name']);
      }
    }
    return undefined;
  }

  @action.bound
  updateTeamMembers(teamId, userIds) {
    console.log('updateTeamMembers', teamId, userIds);
    const team = this.map.get(String(teamId));
    team.memberIds = userIds;
    this.map.set(String(teamId), team);
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
