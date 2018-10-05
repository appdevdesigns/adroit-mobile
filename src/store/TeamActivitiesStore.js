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
  getTeamActivities(teamId) {
    console.log('getTeamActivities', teamId);
    this.fetchCount += 1;
    fetchJson(Api.urls.teamActivities(teamId), {
      method: 'GET',
    })
      .then(teamActivitiesResponse => {
        console.log('getTeamActivities response', teamActivitiesResponse);
        const activitiesMap = keyBy(teamActivitiesResponse.json.data, activity => activity.id);
        runInAction(() => {
          this.map.merge(activitiesMap);
          this.fetchCount = Math.max(this.fetchCount - 1, 0);
        });
        teamActivitiesResponse.json.data.forEach(activity => {
          this.rootStore.activityImages.getActivityImages(activity.id);
        });
      })
      .catch(error => {
        Toast.show({ text: error.message, type: 'danger', buttonText: 'OKAY' });
        runInAction(() => {
          this.map.clear();
          this.latestError = error;
          this.fetchCount = Math.max(this.fetchCount - 1, 0);
        });
      });
  }
}
