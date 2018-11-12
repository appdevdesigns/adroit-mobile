import React from 'react';
import PropTypes from 'prop-types';
import { when } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Container, Header, Title, Button, Left, Body, Icon, Drawer, Fab } from 'native-base';
import AuthStore from 'src/store/AuthStore';
import UsersStore from 'src/store/UsersStore';
import TeamsStore from 'src/store/TeamsStore';
import ActivityImagesStore from 'src/store/ActivityImagesStore';
import { NavigationPropTypes } from 'src/util/PropTypes';
import AppScreen from 'src/components/app/AppScreen';
import Sidebar from './Sidebar';
import ReportingPeriodOverview from './ReportingPeriodOverview';
import ActivityFeedList from './ActivityFeedList';
import ActivityFeedPlaceholder from './ActivityFeedList/Placeholder';
import styles from './style';

@inject('auth', 'users', 'activityImages', 'teams')
@observer
class ActivityFeedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFabActive: false,
      // tempItem: undefined,
      // tempItems: [],
      // selectItems: SELECT_ITEMS,
    };

    // Set up a 'global' handler to return to the login screen if we're logged out
    const { navigate } = this.props.navigation;
    when(
      () => this.props.auth.isLoggedOut,
      () => {
        navigate(AppScreen.Login);
      }
    );
  }

  onLoggedOut = () => {
    this.props.navigation.navigate(AppScreen.Login);
  };

  closeDrawer = () => {
    this.drawer._root.close();
  };

  openDrawer = () => {
    this.drawer._root.open();
  };

  toggleFab = () => {
    this.setState(prevState => ({ isFabActive: !prevState.isFabActive }));
  };

  goToPhotos = () => {
    this.props.navigation.navigate(AppScreen.Photos);
    this.setState({ isFabActive: false });
  };

  goToCamera = () => {
    this.props.navigation.navigate(AppScreen.Camera);
    this.setState({ isFabActive: false });
  };

  render() {
    const { users, teams, activityImages } = this.props;
    const { isFabActive } = this.state;
    const loading = users.isBusy || teams.isBusy || activityImages.isBusy;
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
              <Title>My Activity Photos</Title>
            </Body>
          </Header>
          <ReportingPeriodOverview
            reportingPeriod={activityImages.currentReportingPeriod}
            totalApproved={activityImages.totalReadyOrApproved}
            totalNew={activityImages.totalNew}
          />
          {loading ? <ActivityFeedPlaceholder /> : <ActivityFeedList />}
          <Fab
            active={isFabActive}
            direction="up"
            containerStyle={{}}
            style={styles.fab}
            position="bottomRight"
            onPress={this.toggleFab}
          >
            <Icon type="FontAwesome" name="plus" />
            <Button style={styles.fabImage} onPress={this.goToPhotos}>
              <Icon type="FontAwesome" name="image" />
            </Button>
            <Button style={styles.fabCamera} onPress={this.goToCamera}>
              <Icon type="FontAwesome" name="camera" />
            </Button>
          </Fab>
        </Container>
      </Drawer>
    );
  }
}

ActivityFeedScreen.propTypes = {
  navigation: NavigationPropTypes.isRequired,
};

ActivityFeedScreen.wrappedComponent.propTypes = {
  auth: PropTypes.instanceOf(AuthStore).isRequired,
  users: PropTypes.instanceOf(UsersStore).isRequired,
  activityImages: PropTypes.instanceOf(ActivityImagesStore).isRequired,
  teams: PropTypes.instanceOf(TeamsStore).isRequired,
};

export default ActivityFeedScreen;
