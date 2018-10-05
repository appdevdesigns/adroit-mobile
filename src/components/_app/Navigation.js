import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import LoginScreen from 'src/components/auth/LoginScreen';
import ActivityFeedScreen from 'src/components/activityFeed/ActivityFeedScreen';
import HelpScreen from 'src/components/help/HelpScreen';
import AppScreen from './AppScreen';

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
