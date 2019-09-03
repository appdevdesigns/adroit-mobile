import React from 'react';
import { AppState } from 'react-native';
import { Provider } from 'mobx-react';
import codePush from 'react-native-code-push';
import Config from 'react-native-config';
import { StyleProvider, Root, getTheme } from 'native-base';
import theme from 'src/assets/theme';
import Store from 'src/store';
import Monitoring from 'src/util/Monitoring';
import Notifications from 'src/util/Notifications';
import Navigation from './Navigation';

Monitoring.init();
Notifications.init();

// Disable the 'isMounted() and MobX Provider deprecation warnings from showing up in the yellow box
console.ignoredYellowBox = ['Warning: isMounted', 'MobX Provider:']; // eslint-disable-line

Monitoring.debug('Running with config', Config);

const store = new Store();

// gets the current screen from navigation state
const getActiveRouteName = navigationState => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
};

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      Monitoring.debug('App has come to the foreground - checking session');
      store.auth.checkSession();
    }
    this.setState({appState: nextAppState});
  };

  render() {
    return (
      <Root>
        <StyleProvider style={getTheme(theme)}>
          <Provider {...store}>
            <Navigation
              onNavigationStateChange={(prevState, currentState) => {
                const currentScreen = getActiveRouteName(currentState);
                const prevScreen = getActiveRouteName(prevState);
                if (prevScreen !== currentScreen) {
                  Monitoring.screenView(currentScreen);
                }
              }}
            />
          </Provider>
        </StyleProvider>
      </Root>
    );
  }
}

export default codePush(App);
