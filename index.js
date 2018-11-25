import { AppRegistry } from 'react-native';
import App from './src/components/app';
import { name as appName } from './app.json';

console.log(`Built from Git commit: ${GIT_COMMIT} (https://github.com/appdevdesigns/adroit-mobile/tree/${GIT_COMMIT})`);

AppRegistry.registerComponent(appName, () => App);
