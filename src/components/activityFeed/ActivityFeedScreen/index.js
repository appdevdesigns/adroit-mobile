import React from 'react';
import PropTypes from 'prop-types';
import { when } from 'mobx';
import { inject, observer } from 'mobx-react';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Drawer,
  Spinner,
  ActionSheet,
} from 'native-base';
import AuthStore from 'src/store/AuthStore';
import UsersStore from 'src/store/UsersStore';
import TeamsStore from 'src/store/TeamsStore';
import TeamActivitiesStore from 'src/store/TeamActivitiesStore';
import ActivityImagesStore from 'src/store/ActivityImagesStore';
import { NavigationPropTypes } from 'src/util/PropTypes';
import AppScreen from 'src/components/App/AppScreen';
import Sidebar from './Sidebar';
import AddPhotoCta from './AddPhotoCta';
import ActivityFeedList from './ActivityFeedList';

const ACTION_BUTTONS = [
  { text: 'Camera Roll', icon: 'photos' },
  { text: 'Take Photo', icon: 'camera' },
  { text: 'Cancel', icon: 'close' },
];

const CANCEL_INDEX = 2;

@inject('auth', 'users', 'activityImages', 'teams', 'teamActivities')
@observer
class ActivityFeedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.disposeLogoutWatcher = when(() => this.props.auth.isLoggedOut, this.onLoggedOut);
  }

  componentWillUnmount() {
    this.disposeLogoutWatcher();
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

  openActionSheet = () => {
    ActionSheet.show(
      {
        options: ACTION_BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: 'Add a photo',
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          console.log('Opening Camera roll!');
        } else if (buttonIndex === 1) {
          console.log('Opening camera!');
        }
      }
    );
  };

  render() {
    const { users, teams, teamActivities, activityImages } = this.props;
    const loading = users.fetchCount || teams.fetchCount || teamActivities.fetchCount || activityImages.fetchCount;
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
              <Title>My Photos</Title>
            </Body>
            <Right />
          </Header>
          <AddPhotoCta onPress={this.openActionSheet} />
          <Content>{loading ? <Spinner /> : <ActivityFeedList />}</Content>
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
  teamActivities: PropTypes.instanceOf(TeamActivitiesStore).isRequired,
  teams: PropTypes.instanceOf(TeamsStore).isRequired,
};

export default ActivityFeedScreen;
