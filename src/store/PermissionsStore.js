import { action, runInAction } from 'mobx';
import permission from 'src/util/permission';
import keys from 'lodash-es/keys';

export const Permission = {
  ReadExternalStorage: 'ReadExternalStorage',
  WriteToExternalStorage: 'WriteToExternalStorage',
  TakePhotos: 'TakePhotos',
};

export default class PermissionsStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action.bound
  async init() {
    const permKeys = keys(Permission);
    Promise.all(permKeys.map(key => permission.hasPermission(Permission[key]))).then(values => {
      runInAction(() => {
        permKeys.forEach((key, index) => {
          this[`can${key}`] = values[index];
        });
      });
    });
  }

  @action.bound
  async requestPermission(perm, rationale) {
    if (!this[`can${perm}`]) {
      return permission.requestPermission(perm, rationale);
    }
    return Promise.resolve(true);
  }
}
