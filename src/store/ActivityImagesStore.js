import { action, computed } from 'mobx';
import compareDesc from 'date-fns/compare_desc';
import isWithinRange from 'date-fns/is_within_range';
import Api from 'src/util/api';
import ReportingPeriod from 'src/util/ReportingPeriod';
import ResourceStore from './ResourceStore';

export default class ActivityImagesStore extends ResourceStore {
  constructor(rootStore) {
    super(rootStore, 'id');
    this.currentReportingPeriod = new ReportingPeriod();
  }

  @computed
  get myActivityImages() {
    if (!this.rootStore.users.me.id) {
      return [];
    }
    return this.list
      .filter(
        i =>
          i.taggedPeople.includes(this.rootStore.users.me.id) &&
          isWithinRange(i.date, this.currentReportingPeriod.start, this.currentReportingPeriod.end)
      )
      .sort((a, b) => compareDesc(a.date, b.date));
  }

  @action.bound
  getActivityImages(activity) {
    console.log('getActivityImages', activity.id);
    this.fetchList(Api.urls.activityImages(activity.id));
  }
}
