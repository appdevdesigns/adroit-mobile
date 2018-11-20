import { configure } from 'mobx';
import { AsyncStorage } from 'react-native';
import { create } from 'mobx-persist';
import AuthStore from './AuthStore';
import TeamsStore from './TeamsStore';
import ActivityImagesStore from './ActivityImagesStore';
import UsersStore from './UsersStore';
import PermissionsStore from './PermissionsStore';
import LocationsStore from './LocationsStore';

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
    this.teams = new TeamsStore(this);
    this.activityImages = new ActivityImagesStore(this);
    this.locations = new LocationsStore(this);

    this.users.initialize();
    this.teams.initialize();
    this.activityImages.initialize();
    this.locations.initialize();
  }
}
