import { observable, action, reaction, computed, runInAction } from 'mobx';
import { AsyncStorage } from 'react-native';
import keyBy from 'lodash-es/keyBy';
import filter from 'lodash-es/filter';
import ResourceStore from './ResourceStore';

export const LocationType = {
  FCF: 'FCF',
  User: 'User',
  GPS: 'GPS',
};

export const LocationIcon = {
  GPS: 'location-arrow',
  User: 'user',
  FCF: 'users',
};

const PLACEHOLDER_LOCATIONS = [
  {
    location: 'FCF Office',
    type: LocationType.FCF,
  },
  {
    location: 'DigiServe Office',
    type: LocationType.FCF,
  },
];

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
  return locationA.location.localeCompare(locationB.location);
};

export default class LocationsStore extends ResourceStore {
  constructor(rootStore) {
    super(rootStore, 'location');
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
    return this.list.sort(sortLocations);
  }

  @computed
  get orderedLocations() {
    return this.authenticatedUsersLocations.concat(this.fcfLocations);
  }

  @action.bound
  async addUserLocation({ location }) {
    const newLocation = { location, type: LocationType.User, userId: this.rootStore.users.me.id };
    if (!this.userLocations.find(l => l.location === location)) {
      this.userLocations.unshift(newLocation);
    }
    await LocationsStore.setUserLocations(this.userLocations);
    return newLocation;
  }

  @action.bound
  async removeUserLocation({ location }) {
    this.userLocations = filter(this.userLocations, l => l.location !== location);
    await LocationsStore.setUserLocations(this.userLocations);
  }

  @action.bound
  fetchFcfLocations() {
    console.log('fetchFcfLocations');
    this.map.replace(keyBy(PLACEHOLDER_LOCATIONS, 'location'));
  }

  @action.bound
  async mergeUserLocations() {
    console.log('mergeUserLocations');
    const userLocations = await LocationsStore.getUserLocations();
    runInAction(() => {
      this.userLocations = userLocations;
    });
  }
}
