import { observable, action, runInAction, computed } from 'mobx';
import { Toast } from 'native-base';
import keyBy from 'lodash-es/keyBy';
import compareDesc from 'date-fns/compare_desc';
import fetchJson from 'src/util/fetch';
import Api from 'src/util/api';

export default class ActivityImagesStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable
  fetchCount = 0;

  @observable
  latestError = null;

  @observable
  map = new Map();

  @computed
  get myActivityImages() {
    if (!this.rootStore.users.me.id) {
      return [];
    }
    const images = [];
    this.map.forEach(i => {
      images.push(i);
    });
    return images
      .filter(i => i.taggedPeople.includes(this.rootStore.users.me.id))
      .sort((a, b) => compareDesc(a.date, b.date));
  }

  @action.bound
  getActivityImages(activity) {
    console.log('getActivityImages', activity.id);
    this.fetchCount += 1;
    fetchJson(Api.urls.activityImages(activity.id), {
      method: 'GET',
    })
      .then(activityImagesResponse => {
        console.log('getActivityImages response', activityImagesResponse);
        const withContext = activityImagesResponse.json.data.map(activityImage => ({
          ...activityImage,
          activity,
        }));
        const imagesMap = keyBy(withContext, image => image.id);
        runInAction(() => {
          this.map.merge(imagesMap);
          this.fetchCount = Math.max(this.fetchCount - 1, 0);
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
