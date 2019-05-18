import { observable, action, reaction, runInAction, computed } from 'mobx';
import { persist } from 'mobx-persist';
import keyBy from 'lodash-es/keyBy';
import sortBy from 'lodash-es/sortBy';
import Copy from 'src/assets/Copy';
import Toast from 'src/util/Toast';
import fetchJson from 'src/util/fetch';
import Monitoring from 'src/util/Monitoring';

const defaultOptions = { method: 'GET' };

export const PostStatus = {
  pending: 'pending',
  sending: 'sending',
  succeeded: 'succeeded',
  failed: 'failed',
};

export default class ResourceStore {
  constructor(rootStore, idAttribute, resetOnLogout = false) {
    this.rootStore = rootStore;
    this.idAttribute = idAttribute;
    this.resetOnLogout = resetOnLogout;
    if (resetOnLogout) {
      reaction(
        () => this.rootStore.auth.isLoggedOut,
        isLoggedOut => {
          if (isLoggedOut) {
            this.clear();
          }
        }
      );
    }
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
    const onListResponse = response => {
      const map = keyBy(response.json.data, i => String(i[this.idAttribute]));
      runInAction(() => {
        if (this.map.size) {
          this.map.replace(map);
        } else {
          this.map.merge(map);
        }
        this.isInitialized = true;
        this.fetchCount = Math.max(this.fetchCount - 1, 0);
      });
      this.onFetchListSuccess(response.json.data, meta);
    };

    return this.fetch(url, onListResponse, options, meta);
  }

  @action.bound
  fetch(url, onResponse, options = defaultOptions, meta = {}) {
    this.fetchCount += 1;
    this.errors = [];
    fetchJson(url, options)
      .then(onResponse)
      .catch(async error => {
        runInAction(() => {
          this.errors.push(error);
          this.fetchCount = Math.max(this.fetchCount - 1, 0);
        });
        this.onFetchListFail(error, meta);
        if (error.status === 401) {
          await this.onUnauthorised();
        } else {
          Monitoring.exception(error, { problem: 'API request failed', url, options });
        }
      });
  }

  onFetchListSuccess(list) {
    // Do nothing
  }

  onFetchListFail(error) {
    if (error.status !== 401) {
      Toast.danger(Copy.toast.genericError);
    }
  }

  async onUnauthorised() {
    Toast.danger(Copy.toast.unauthorized);
    await this.rootStore.auth.logout();
  }
}
