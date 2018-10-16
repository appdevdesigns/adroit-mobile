import { action, reaction } from 'mobx';
import keyBy from 'lodash-es/keyBy';
import ResourceStore from './ResourceStore';

const PLACEHOLDER_LOCATIONS = [
  {
    location: 'FCF Office',
  },
  {
    location: 'DigiServe Office',
  },
];

export default class LocationsStore extends ResourceStore {
  constructor(rootStore) {
    super(rootStore, 'location');
    reaction(
      () => this.rootStore.auth.isLoggedIn,
      isLoggedIn => {
        if (isLoggedIn) {
          this.getFcfLocations();
        }
      }
    );
  }

  @action.bound
  getFcfLocations() {
    console.log('getFcfLocations');
    this.map.merge(keyBy(PLACEHOLDER_LOCATIONS, 'location'));
  }
}
