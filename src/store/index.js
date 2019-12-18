import { configure } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';
import { create } from 'mobx-persist';
import AuthStore from './AuthStore';
import ProjectsStore from './ProjectsStore';
import ActivityImagesStore from './ActivityImagesStore';
import UsersStore from './UsersStore';
import PermissionsStore from './PermissionsStore';
import LocationsStore from './LocationsStore';
import DeviceInfoStore from './DeviceInfoStore';
import DraftActivityImageStore from './DraftActivityImageStore';
import DraftActivityStore from './DraftActivityStore';

configure({ enforceActions: 'always' });

export default class Store {
  constructor() {
    this.hydrate = create({
      storage: AsyncStorage,
      jsonify: true,
    });
    this.auth = new AuthStore(this);
    this.permissions = new PermissionsStore(this);
    this.users = new UsersStore(this);
    this.projects = new ProjectsStore(this);
    this.activityImages = new ActivityImagesStore(this);
    this.locations = new LocationsStore(this);
    this.deviceInfo = new DeviceInfoStore(this);
    this.draft = new DraftActivityImageStore(this);
    this.draftActivity = new DraftActivityStore(this);

    this.users.initialize();
    this.projects.initialize();
    this.activityImages.initialize();
    this.locations.initialize();
  }
}
