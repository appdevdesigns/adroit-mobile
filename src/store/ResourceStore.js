import { observable, action, runInAction, computed } from 'mobx';
import { Toast } from 'native-base';
import keyBy from 'lodash-es/keyBy';
import sortBy from 'lodash-es/sortBy';
import fetchJson from 'src/util/fetch';

const defaultOptions = { method: 'GET' };

export default class ResourceStore {
  constructor(rootStore, idAttribute) {
    this.rootStore = rootStore;
    this.idAttribute = idAttribute;
  }

  @observable
  fetchCount = 0;

  @observable
  errors = [];

  @observable
  map = new Map();

  @computed
  get list() {
    return sortBy(Array.from(this.map.values()), [this.idAttribute]);
  }

  @action.bound
  fetchList(url, options = defaultOptions) {
    this.fetchCount += 1;
    this.errors = [];
    fetchJson(url, options)
      .then(response => {
        console.log('response', response);
        const map = keyBy(response.json.data, this.idAttribute);
        runInAction(() => {
          this.map.merge(map);
          this.fetchCount = Math.max(this.fetchCount - 1, 0);
        });
        this.onFetchListSuccess(response.json.data);
      })
      .catch(async error => {
        runInAction(() => {
          this.errors.push(error);
          this.fetchCount = Math.max(this.fetchCount - 1, 0);
        });
        this.onFetchListFail(error);
        if (error.status === 401) {
          await this.onUnauthorised();
        }
      });
  }

  onFetchListSuccess(list) {
    // Do nothing
  }

  onFetchListFail(error) {
    Toast.show({ text: error.message, type: 'danger', buttonText: 'OKAY' });
  }

  async onUnauthorised() {
    Toast.show({ text: 'Please login again', type: 'danger', buttonText: 'OKAY' });
    await this.rootStore.auth.logout();
  }
}
