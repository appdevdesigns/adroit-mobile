import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import LoginScreen from 'src/components/auth/LoginScreen';
import ActivityFeedScreen from 'src/components/activityFeed/ActivityFeedScreen';
import CameraRollScreen from 'src/components/photos/CameraRollScreen';
import CameraScreen from 'src/components/photos/CameraScreen';
import AddPhotoScreen from 'src/components/addPhoto/AddPhotoScreen';
import HelpScreen from 'src/components/help/HelpScreen';
import FeedbackScreen from 'src/components/help/FeedbackScreen';
import EditLocationsScreen from 'src/components/settings/EditLocationsScreen';
import TestScreen from 'src/components/dev/TestScreen';
import AppScreen from './AppScreen';

const AppStack = createStackNavigator(
  {
    [AppScreen.ActivityFeed]: ActivityFeedScreen,
    [AppScreen.Photos]: CameraRollScreen,
    [AppScreen.Camera]: CameraScreen,
    [AppScreen.Help]: HelpScreen,
    [AppScreen.Feedback]: FeedbackScreen,
    [AppScreen.AddPhoto]: AddPhotoScreen,
    [AppScreen.EditLocations]: EditLocationsScreen,
    [AppScreen.Test]: TestScreen,
  },
  {
    navigationOptions: {
      header: null,
    },
    headerMode: 'screen',
  }
);

export default createSwitchNavigator(
  {
    [AppScreen.App]: AppStack,
    [AppScreen.Login]: LoginScreen,
    [AppScreen.Test]: TestScreen,
  },
  {
    initialRouteName: AppScreen.Login,
  }
);
