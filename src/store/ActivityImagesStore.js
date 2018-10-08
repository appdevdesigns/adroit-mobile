import { action, computed } from 'mobx';
import compareDesc from 'date-fns/compare_desc';
import Api from 'src/util/api';
import ResourceStore from './ResourceStore';

export default class ActivityImagesStore extends ResourceStore {
  constructor(rootStore) {
    super(rootStore, 'id');
  }

  @computed
  get myActivityImages() {
    if (!this.rootStore.users.me.id) {
      return [];
    }
    console.log('this.list', this.list);
    return this.list
      .filter(i => i.taggedPeople.includes(this.rootStore.users.me.id))
      .sort((a, b) => compareDesc(a.date, b.date));
  }

  @action.bound
  getActivityImages(activity) {
    console.log('getActivityImages', activity.id);
    this.fetchList(Api.urls.activityImages(activity.id));
  }
}
