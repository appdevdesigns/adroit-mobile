import { observable, action } from 'mobx';
import Orientation from 'react-native-orientation';

export default class DeviceInfoStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
    Orientation.addOrientationListener(this.orientationDidChange);
  }

  @observable
  orientation = Orientation.getInitialOrientation();

  @action.bound
  orientationDidChange(orientation) {
    this.orientation = orientation;
  }
}
