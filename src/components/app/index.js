import React from 'react';
import { Provider } from 'mobx-react';
import Config from 'react-native-config';
import { StyleProvider, Root, getTheme } from 'native-base';
import Geocode from 'react-geocode';
import theme from 'src/assets/theme';
import Store from 'src/store';
import Navigation from './Navigation';

// Disable the 'isMounted() and MobX Provider deprecation warnings from showing up in the yellow box
console.ignoredYellowBox = ['Warning: isMounted', 'MobX Provider:']; // eslint-disable-line

console.log('Running with config', Config);
if (!Config.ADROIT_GMAPS_API_KEY) {
  throw new Error('ADROIT_GMAPS_API_KEY must be set in the .env file');
}
Geocode.setApiKey(Config.ADROIT_GMAPS_API_KEY);

const store = new Store();

const App = () => (
  <Root>
    <StyleProvider style={getTheme(theme)}>
      <Provider {...store}>
        <Navigation />
      </Provider>
    </StyleProvider>
  </Root>
);

export default App;
