import { action, reaction } from 'mobx';
import forEach from 'lodash-es/forEach';
import Api from 'src/util/api';
import ResourceStore from './ResourceStore';

export default class TeamsStore extends ResourceStore {
  constructor(rootStore) {
    super(rootStore, 'IDMinistry', true);
    reaction(
      () => this.rootStore.auth.isLoggedIn,
      isLoggedIn => {
        if (isLoggedIn) {
          this.listMyTeams();
        }
      }
    );
  }

  getActivity(activityId) {
    let activity;
    forEach(this.list, team => {
      const a = team.activities.find(act => act.id === activityId);
      if (a) {
        activity = {
          activity_name: a.activity_name,
          id: a.id,
          team: {
            IDMinistry: team.IDMinistry,
            MinistryDisplayName: team.MinistryDisplayName,
          },
        };
      }
    });
    return activity;
  }

  @action.bound
  listMyTeams() {
    console.log('listMyTeams');
    const fullUrl = `${Api.urls.myTeams}?DateMinistryEnded=null`;
    this.fetchList(fullUrl);
  }
}
