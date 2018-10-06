import { observable, action, runInAction } from 'mobx';
import { Toast } from 'native-base';
import keyBy from 'lodash-es/keyBy';
import fetchJson from 'src/util/fetch';
import Api from 'src/util/api';

export default class TeamActivitiesStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable
  fetchCount = 0;

  @observable
  latestError = null;

  @observable
  map = new Map();

  @action.bound
  getTeamActivities(team) {
    console.log('getTeamActivities', team.IDMinistry);
    this.fetchCount += 1;
    fetchJson(Api.urls.teamActivities(team.IDMinistry), {
      method: 'GET',
    })
      .then(teamActivitiesResponse => {
        console.log('getTeamActivities response', teamActivitiesResponse);
        const withContext = teamActivitiesResponse.json.data.map(teamActivity => ({
          ...teamActivity,
          team,
        }));
        // this.rootStore.teams.addActivities(team, withContext);
        const activitiesMap = keyBy(withContext, activity => activity.id);
        runInAction(() => {
          this.map.merge(activitiesMap);
          this.fetchCount = Math.max(this.fetchCount - 1, 0);
        });
        withContext.forEach(activity => {
          this.rootStore.activityImages.getActivityImages(activity);
        });
      })
      .catch(error => {
        Toast.show({ text: error.message, type: 'danger', buttonText: 'OKAY' });
        runInAction(() => {
          this.latestError = error;
          this.fetchCount = Math.max(this.fetchCount - 1, 0);
        });
      });
  }
}
