import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import AppScreen from './AppScreen';
import LoginScreen from '../auth/LoginScreen';
import ActivityFeedScreen from '../activityFeed/ActivityFeedScreen';

const AppStack = createStackNavigator(
  {
    [AppScreen.ActivityFeed]: ActivityFeedScreen,
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
