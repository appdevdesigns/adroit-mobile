import { action, reaction, runInAction, computed } from 'mobx';
import { AsyncStorage } from 'react-native';
import keyBy from 'lodash-es/keyBy';
import filter from 'lodash-es/filter';
import ResourceStore from './ResourceStore';

export const LocationType = {
  FCF: 'FCF',
  User: 'User',
  GPS: 'GPS',
};

const LocationOrder = {
  GPS: 0,
  User: 1,
  FCF: 2,
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

const compareInts = (a, b) => {
  if (a === b) {
    return 0;
  }
  if (a < b) {
    return -1;
  }
  return 1;
};

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
  const typeOrder = compareInts(LocationOrder[locationA.type], LocationOrder[locationB.type]);
  if (typeOrder === 0) {
    return locationA.location.localeCompare(locationB.location);
  }
  return typeOrder;
};

export default class LocationsStore extends ResourceStore {
  constructor(rootStore) {
    super(rootStore, 'location');
    reaction(
      () => this.rootStore.auth.isLoggedIn,
      async isLoggedIn => {
        if (isLoggedIn) {
          await this.mergeFcfLocations();
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

  @computed
  get userLocations() {
    return this.list.filter(l => l.type === LocationType.User);
  }

  @computed
  get orderedLocations() {
    return this.list.sort(sortLocations);
  }

  @action.bound
  async addUserLocation({ location }) {
    const userLocations = await LocationsStore.getUserLocations();
    const newLocation = { location, type: LocationType.User };
    if (!userLocations.find(l => l.location === location)) {
      userLocations.unshift(newLocation);
    }
    await LocationsStore.setUserLocations(userLocations);
    runInAction(() => {
      this.map.set(location, newLocation);
    });
    return newLocation;
  }

  @action.bound
  async removeUserLocation({ location }) {
    let userLocations = await LocationsStore.getUserLocations();
    userLocations = filter(userLocations, l => l.location !== location);
    await LocationsStore.setUserLocations(userLocations);
    runInAction(() => {
      this.map.delete(location);
    });
  }

  @action.bound
  mergeFcfLocations() {
    console.log('mergeFcfLocations');
    this.map.merge(keyBy(PLACEHOLDER_LOCATIONS, 'location'));
  }

  @action.bound
  async mergeUserLocations() {
    console.log('mergeUserLocations');
    const userLocations = await LocationsStore.getUserLocations();
    runInAction(() => {
      if (userLocations.length) {
        this.map.merge(keyBy(userLocations, 'location'));
      }
    });
  }
}
