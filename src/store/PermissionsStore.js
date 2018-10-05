import { observable, action, runInAction } from 'mobx';
import permission from 'src/util/permission';

export const Permission = {
  CameraRoll: 'CameraRoll',
  Camera: 'Camera',
};

export default class PermissionsStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable
  canAccessCameraRoll = false;

  @observable
  canAccessCamera = false;

  @action.bound
  async init() {
    const canAccessCameraRoll = !!(await permission.hasPermission(Permission.CameraRoll));
    const canAccessCamera = !!(await permission.hasPermission(Permission.Camera));
    runInAction(() => {
      this.canAccessCameraRoll = canAccessCameraRoll;
      this.canAccessCamera = canAccessCamera;
    });
  }

  @action.bound
  async requestPermission(perm, rationale) {
    if (!this[`canAccess${perm}`]) {
      return permission.requestPermission(perm, rationale);
    }
    return Promise.resolve(true);
  }
}
