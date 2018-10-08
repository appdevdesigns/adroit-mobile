import { action } from 'mobx';
import Api from 'src/util/api';
import ResourceStore from './ResourceStore';

export default class TeamActivitiesStore extends ResourceStore {
  constructor(rootStore) {
    super(rootStore, 'id');
  }

  @action.bound
  getTeamActivities(team) {
    console.log('getTeamActivities', team.IDMinistry);
    this.fetchList(Api.urls.teamActivities(team.IDMinistry));
  }

  @action.bound
  onFetchListSuccess(list) {
    list.forEach(activity => {
      this.rootStore.activityImages.getActivityImages(activity);
    });
  }
}
