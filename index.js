import { AppRegistry } from 'react-native';
import App from './src/components/app';
import { name as appName } from './app.json';

// Can't use GIT_COMMIT yet as babel-plugin-git-version doesn't support Babel 7 so its been removed
// console.log(`Built from Git commit: ${GIT_COMMIT} (https://github.com/appdevdesigns/adroit-mobile/tree/${GIT_COMMIT})`);

AppRegistry.registerComponent(appName, () => App);
