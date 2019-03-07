import { action, computed, reaction } from 'mobx';
import compareDesc from 'date-fns/compare_desc';
import Api from 'src/util/api';
import { format } from 'src/util/date';
import ReportingPeriod from 'src/util/ReportingPeriod';
import ResourceStore from './ResourceStore';

const sortByDate = (activityA, activityB) => {
  if (!activityA && !activityB) {
    return 0;
  }
  if (!activityA) {
    return 1;
  }
  if (!activityB) {
    return -1;
  }
  const dateResult = compareDesc(activityA.date, activityB.date);
  if (dateResult === 0) {
    return compareDesc(activityA.createdAt, activityB.createdAt);
  }
  return dateResult;
};

export default class ActivityImagesStore extends ResourceStore {
  constructor(rootStore) {
    super(rootStore, 'id', true);
    this.currentReportingPeriod = new ReportingPeriod();
    reaction(
      () => this.rootStore.auth.isLoggedIn,
      isLoggedIn => {
        if (isLoggedIn) {
          this.getMyActivityImages();
        }
      }
    );
  }

  @computed
  get totalReadyOrApproved() {
    // eslint-disable-next-line prefer-destructuring
    const myActivityImages = this.myActivityImages;
    if (!myActivityImages) {
      return 0;
    }
    return this.myActivityImages.filter(a => a.status === 'approved' || a.status === 'ready').length;
  }

  @computed
  get totalNew() {
    // eslint-disable-next-line prefer-destructuring
    const myActivityImages = this.myActivityImages;
    if (!myActivityImages) {
      return 0;
    }
    return myActivityImages.filter(a => a.status === 'new').length;
  }

  @computed
  get myActivityImages() {
    if (!this.rootStore.users.me.id) {
      return null;
    }
    return this.list.sort(sortByDate);
  }

  @action.bound
  getMyActivityImages() {
    const fullUrl = `${Api.urls.myActivityImages}?date[>]=${format(this.currentReportingPeriod.start, 'YYYY/MM/DD')}`;
    this.fetchList(fullUrl);
  }
}
