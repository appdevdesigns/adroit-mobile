import React from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native';
import { copilot } from '@okgrow/react-native-copilot';
import { when } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Container, Header, Title, Button, Left, Body, Icon, Drawer } from 'native-base';
import Copy from 'src/assets/Copy';
import AuthStore from 'src/store/AuthStore';
import ActivityImagesStore from 'src/store/ActivityImagesStore';
import { NavigationPropTypes } from 'src/util/PropTypes';
import AppScreen from 'src/components/app/AppScreen';
import Sidebar from './Sidebar';
import ReportingPeriodOverview from './ReportingPeriodOverview';
import ActivityFeedList from './ActivityFeedList';
import ActivityFeedFab from './ActivityFeedFab';

@inject('auth', 'activityImages')
@observer
class ActivityFeedScreen extends React.Component {
  constructor(props) {
    super(props);
    // Set up a 'global' handler to return to the login screen if we're logged out
    when(
      () => this.props.auth.isLoggedOut,
      () => {
        this.props.navigation.navigate(AppScreen.Login);
      }
    );
    // Start the onboarding tutorial once we've fetched our activities
    when(
      () => this.props.activityImages.myActivityImages !== null,
      async () => {
        const hasViewedOnboarding = await AsyncStorage.getItem('adroit_has_viewed_onboarding');
        if (hasViewedOnboarding !== 'true') {
          this.props.start();
        } else {
          console.log('Skipping onboarding - already viewed');
        }
      }
    );
  }

  componentDidMount() {
    this.props.copilotEvents.on('stop', async () => AsyncStorage.setItem('adroit_has_viewed_onboarding', 'true'));
  }

  componentWillUnmount() {
    this.props.copilotEvents.off('stop');
  }

  closeDrawer = () => {
    this.drawer._root.close();
  };

  openDrawer = () => {
    this.drawer._root.open();
  };

  render() {
    return (
      <Drawer
        ref={ref => {
          this.drawer = ref;
        }}
        content={<Sidebar />}
        onClose={this.closeDrawer}
      >
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={this.openDrawer}>
                <Icon type="FontAwesome" name="bars" />
              </Button>
            </Left>
            <Body>
              <Title>{Copy.activityFeedTitle}</Title>
            </Body>
          </Header>
          <ReportingPeriodOverview />
          <ActivityFeedList />
          <ActivityFeedFab />
        </Container>
      </Drawer>
    );
  }
}

ActivityFeedScreen.propTypes = {
  navigation: NavigationPropTypes.isRequired,
  start: PropTypes.func.isRequired,
  copilotEvents: PropTypes.shape({
    on: PropTypes.func,
    off: PropTypes.func,
  }).isRequired,
};

ActivityFeedScreen.wrappedComponent.propTypes = {
  auth: PropTypes.instanceOf(AuthStore).isRequired,
  activityImages: PropTypes.instanceOf(ActivityImagesStore).isRequired,
};

export default copilot({
  overlay: 'svg',
  animated: true,
  androidStatusBarVisible: true,
})(ActivityFeedScreen);
