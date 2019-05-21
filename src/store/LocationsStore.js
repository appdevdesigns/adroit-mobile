import { observable, action, reaction, computed, runInAction } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';
import filter from 'lodash-es/filter';
import Api from 'src/util/api';
import ResourceStore from './ResourceStore';

const sortLocations = (locationA, locationB) => {
  if (!locationA && !locationB) {
    return 0;
  }
  if (!locationA) {
    return 1;
  }
  if (!locationB) {
    return -1;
  }
  // Lower priority number = list first!
  if (locationA.priority < locationB.priority) {
    return -1;
  }
  if (locationB.priority < locationA.priority) {
    return 1;
  }
  return locationA.name.localeCompare(locationB.name, undefined, { sensitivity: 'base' });
};

export default class LocationsStore extends ResourceStore {
  constructor(rootStore) {
    super(rootStore, 'id');
    reaction(
      () => this.rootStore.auth.isLoggedIn,
      async isLoggedIn => {
        if (isLoggedIn) {
          await this.fetchFcfLocations();
          await this.mergeUserLocations();
        }
      }
    );
  }

  static async getUserLocations() {
    const userLocations = await AsyncStorage.getItem('adroit_locations');
    if (userLocations) {
      return JSON.parse(userLocations);
    }
    return [];
  }

  static async setUserLocations(userLocations) {
    await AsyncStorage.setItem('adroit_locations', JSON.stringify(userLocations));
  }

  @observable
  userLocations = [];

  @computed
  get authenticatedUsersLocations() {
    return this.userLocations.filter(l => l.userId && l.userId === this.rootStore.users.me.id);
  }

  @computed
  get fcfLocations() {
    return this.list.filter(l => l.active).sort(sortLocations);
  }

  @computed
  get orderedLocations() {
    return this.authenticatedUsersLocations.concat(this.fcfLocations);
  }

  getLocation(name) {
    return this.orderedLocations.find(l => l.name === name) || { name };
  }

  @action.bound
  async addUserLocation({ name }) {
    const newLocation = { name, userId: this.rootStore.users.me.id };
    if (!this.userLocations.find(l => l.name === name)) {
      this.userLocations.unshift(newLocation);
    }
    await LocationsStore.setUserLocations(this.userLocations);
    return newLocation;
  }

  @action.bound
  async removeUserLocation({ name }) {
    this.userLocations = filter(this.userLocations, l => l.name !== name);
    await LocationsStore.setUserLocations(this.userLocations);
  }

  @action.bound
  fetchFcfLocations() {
    this.fetchList(Api.urls.locations);
  }

  @action.bound
  async mergeUserLocations() {
    const userLocations = await LocationsStore.getUserLocations();
    runInAction(() => {
      this.userLocations = userLocations;
    });
  }
}
