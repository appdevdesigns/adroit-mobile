import React from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native';
import codePush from 'react-native-code-push';
import { copilot } from '@okgrow/react-native-copilot';
import { when } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Container, Header, Title, Button, Left, Body, Right, Icon, Drawer } from 'native-base';
import Copy from 'src/assets/Copy';
import baseStyles from 'src/assets/style';
import AuthStore from 'src/store/AuthStore';
import AdroitScreen from 'src/components/common/AdroitScreen';
import ActivityImagesStore from 'src/store/ActivityImagesStore';
import { NavigationPropTypes } from 'src/util/PropTypes';
import AppScreen from 'src/components/app/AppScreen';
import Monitoring, { Event } from 'src/util/Monitoring';
import Sidebar from './Sidebar';
import ReportingPeriodOverview from './ReportingPeriodOverview';
import ActivityFeedList from './ActivityFeedList';
import ActivityFeedFab from './ActivityFeedFab';
import IntroModal from './IntroModal';

@inject('auth', 'activityImages')
@observer
class ActivityFeedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      introModalOpen: false,
    };
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
          this.setState({ introModalOpen: true });
        } else {
          Monitoring.debug('Skipping onboarding - already viewed');
        }
      }
    );
  }

  componentDidMount() {
    this.props.copilotEvents.on('stop', async () => {
      Monitoring.event(Event.OnboardingStopped);
      codePush.allowRestart();
      AsyncStorage.setItem('adroit_has_viewed_onboarding', 'true');
    });
    this.props.copilotEvents.on('stepChange', ({ name, order }) => {
      Monitoring.event(Event.OnboardingStepViewed, { name, order });
    });
  }

  componentWillUnmount() {
    this.props.copilotEvents.off('stop');
    this.props.copilotEvents.off('stepChange');
  }

  closeDrawer = () => {
    this.drawer._root.close();
  };

  openDrawer = () => {
    this.drawer._root.open();
  };

  startTutorial = (fromMenu = false) => {
    if (fromMenu) {
      this.closeDrawer();
    }
    this.setState({ introModalOpen: false }, () => {
      Monitoring.event(Event.OnboardingStarted, { fromMenu });
      codePush.disallowRestart();
      this.props.start();
    });
  };

  skipTutorial = () => {
    this.setState({ introModalOpen: false });
    Monitoring.event(Event.OnboardingSkipped);
    AsyncStorage.setItem('adroit_has_viewed_onboarding', 'true');
  };

  render() {
    const { introModalOpen } = this.state;
    return (
      <AdroitScreen>
        <Drawer
          ref={ref => {
            this.drawer = ref;
          }}
          content={
            <Sidebar
              onStartTutorial={() => {
                this.startTutorial(true);
              }}
              onClose={this.closeDrawer}
            />
          }
          onClose={this.closeDrawer}
        >
          <Container>
            <Header>
              <Left style={baseStyles.headerLeft}>
                <Button transparent onPress={this.openDrawer}>
                  <Icon type="FontAwesome" name="bars" />
                </Button>
              </Left>
              <Body style={baseStyles.headerBody}>
                <Title>{Copy.activityFeedTitle}</Title>
              </Body>
              <Right style={baseStyles.headerRight} />
            </Header>
            <ReportingPeriodOverview />
            <ActivityFeedList />
            <ActivityFeedFab />
            <IntroModal visible={introModalOpen} onCancel={this.skipTutorial} onConfirm={this.startTutorial} />
          </Container>
        </Drawer>
      </AdroitScreen>
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
