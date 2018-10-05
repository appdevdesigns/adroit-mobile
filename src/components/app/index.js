import React from 'react';
// import { autorun } from 'mobx';
import { Provider } from 'mobx-react';
import { StyleProvider, Root } from 'native-base';
import getTheme from 'native-base-theme/components';
import theme from 'src/assets/theme';
import Store from 'src/store';
import Navigation from './Navigation';

// Disable the 'isMounted() deprecation warning from showing up in the yellow box
console.ignoredYellowBox = ['Warning: isMounted']; // eslint-disable-line

const App = () => {
  const store = new Store();
  return (
    <Root>
      <StyleProvider style={getTheme(theme)}>
        <Provider {...store}>
          <Navigation />
        </Provider>
      </StyleProvider>
    </Root>
  );
};

// autorun(r => {
//   r.trace();
//   console.log(store.auth);
// });

export default App;