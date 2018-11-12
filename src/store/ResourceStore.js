import { observable, action, runInAction, computed } from 'mobx';
import { persist } from 'mobx-persist';
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
  isInitialized = false;

  @observable
  fetchCount = 0;

  @observable
  errors = [];

  @persist('map')
  @observable
  map = new Map();

  @computed
  get isBusy() {
    return this.fetchCount > 0;
  }

  @computed
  get list() {
    return sortBy(Array.from(this.map.values()), [this.idAttribute]);
  }

  @action.bound
  initialize() {
    this.rootStore.hydrate(this.constructor.name, this).then(() => {
      console.log(`${this.constructor.name} initialized`, this.list);
      runInAction(() => {
        this.isInitialized = true;
      });
    });
  }

  @action.bound
  clear() {
    this.map.clear();
    this.isInitialized = false;
  }

  @action.bound
  fetchList(url, options = defaultOptions, meta = {}) {
    this.fetchCount += 1;
    this.errors = [];
    fetchJson(url, options)
      .then(response => {
        console.log(`${url} response`, response);
        const map = keyBy(response.json.data, i => String(i[this.idAttribute]));
        runInAction(() => {
          this.map.replace(map);
          this.isInitialized = true;
          this.fetchCount = Math.max(this.fetchCount - 1, 0);
        });
        this.onFetchListSuccess(response.json.data, meta);
      })
      .catch(async error => {
        runInAction(() => {
          this.errors.push(error);
          this.fetchCount = Math.max(this.fetchCount - 1, 0);
        });
        this.onFetchListFail(error, meta);
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
