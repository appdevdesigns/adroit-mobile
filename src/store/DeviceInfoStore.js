import { observable, action, runInAction } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';
import Orientation from 'react-native-orientation';
import codePush from 'react-native-code-push';
import Monitoring, { Event } from 'src/util/Monitoring';
import Toast from 'src/util/Toast';
import Copy from 'src/assets/Copy';

const AS_KEY_CODE_PUSH_LABEL = 'adroit-code-push-label';
const UNKNOWN_CODE_PUSH_LABEL = '';

export default class DeviceInfoStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
    Orientation.addOrientationListener(this.orientationDidChange);
  }

  @observable
  orientation = Orientation.getInitialOrientation();

  @observable
  codePushMetaData = null;

  @action.bound
  orientationDidChange(orientation) {
    this.orientation = orientation;
  }

  /**
   * Update the cached Code Push meta data.
   *
   * We store the current code push label in AsyncStorage. If the label returned by
   * 'getUpdateMetadata' doesn't match this label, we force a logout which in turn clears
   * the cached user data. This is a fairly robust way of mitigating changes to the structure
   * of the data that is cached (e.g. if the update intruduces an API change).
   *
   * If the user is already logged out, there is no cached data to clear!
   */
  @action.bound
  async checkCodePushVersion() {
    const metaData = await codePush.getUpdateMetadata();
    runInAction(() => {
      this.codePushMetaData = metaData;
    });

    const newCodePushLabel = (metaData && metaData.label) || UNKNOWN_CODE_PUSH_LABEL;
    const prevCodePushLabel = (await AsyncStorage.getItem(AS_KEY_CODE_PUSH_LABEL)) || UNKNOWN_CODE_PUSH_LABEL;
    await AsyncStorage.setItem(AS_KEY_CODE_PUSH_LABEL, newCodePushLabel);
    if (newCodePushLabel !== prevCodePushLabel) {
      Monitoring.event(Event.CodePushUpdateInstalled, { metaData });
      Toast.success(Copy.toast.appUpdated);
      await this.rootStore.auth.logout();
    }
  }
}
