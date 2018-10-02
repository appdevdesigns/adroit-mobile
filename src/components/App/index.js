import React from 'react';
// import { autorun } from 'mobx';
import { Provider } from 'mobx-react';
import Navigation from './Navigation';
import Store from '../../store';

// Disable the 'isMounted() deprecation warning from showing up in the yellow box
console.ignoredYellowBox = ['Warning: isMounted']; // eslint-disable-line

const App = () => {
  const store = new Store();
  return (
    <Provider {...store}>
      <Navigation />
    </Provider>
  );
};

// autorun(r => {
//   r.trace();
//   console.log(store.auth);
// });

export default App;
