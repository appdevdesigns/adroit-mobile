import { configure } from 'mobx';
import AuthStore from './AuthStore';
import TeamsStore from './TeamsStore';
import ActivityImagesStore from './ActivityImagesStore';
import UsersStore from './UsersStore';
import PermissionsStore from './PermissionsStore';
import LocationsStore from './LocationsStore';

configure({ enforceActions: 'always' });

export default class Store {
  auth = new AuthStore(this);

  permissions = new PermissionsStore(this);

  users = new UsersStore(this);

  teams = new TeamsStore(this);

  activityImages = new ActivityImagesStore(this);

  locations = new LocationsStore(this);
}
