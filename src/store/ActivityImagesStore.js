import { observable, action, runInAction } from 'mobx';
import { Toast } from 'native-base';
import keyBy from 'lodash-es/keyBy';
import fetchJson from '../util/fetch';
import Api from '../util/api';

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

  @action.bound
  getActivityImages(activityId) {
    console.log('getActivityImages', activityId);
    this.fetchCount += 1;
    fetchJson(Api.urls.activityImages(activityId), {
      method: 'GET',
    })
      .then(activityImagesResponse => {
        console.log('getActivityImages response', activityImagesResponse);
        const imagesMap = keyBy(activityImagesResponse.json.data, image => image.id);
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
