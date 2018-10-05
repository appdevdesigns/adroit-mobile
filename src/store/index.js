import { configure } from 'mobx';
import AuthStore from './AuthStore';
import TeamsStore from './TeamsStore';
import TeamActivitiesStore from './TeamActivitiesStore';
import ActivityImagesStore from './ActivityImagesStore';
import UsersStore from './UsersStore';
import PermissionsStore from './PermissionsStore';

configure({ enforceActions: 'always' });

export default class Store {
  auth = new AuthStore(this);

  permissions = new PermissionsStore(this);

  users = new UsersStore(this);

  teams = new TeamsStore(this);

  teamActivities = new TeamActivitiesStore(this);

  activityImages = new ActivityImagesStore(this);
}
