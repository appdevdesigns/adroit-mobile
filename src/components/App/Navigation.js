import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import AppScreen from './AppScreen';
import LoginScreen from '../auth/LoginScreen';
import ActivityFeedScreen from '../activityFeed/ActivityFeedScreen';
import HelpScreen from '../help/HelpScreen';

const AppStack = createStackNavigator(
  {
    [AppScreen.ActivityFeed]: ActivityFeedScreen,
    [AppScreen.Help]: HelpScreen,
    // [AppScreen.Camera]: CameraScreen,
    // [AppScreen.Photos]: CameraRollScreen,
    // [AppScreen.AddPhoto]: AddPhotoScreen,
  },
  {
    navigationOptions: {
      header: null,
    },
  }
);

export default createSwitchNavigator(
  {
    [AppScreen.App]: AppStack,
    [AppScreen.Login]: LoginScreen,
  },
  {
    initialRouteName: AppScreen.Login,
  }
);
