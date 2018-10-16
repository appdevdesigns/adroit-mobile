import React from 'react';
import PropTypes from 'prop-types';
import { when } from 'mobx';
import { inject, observer } from 'mobx-react';
import {
  Container,
  Header,
  Title,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Drawer,
  ActionSheet,
  Item,
  Label,
  Input,
} from 'native-base';
import AuthStore from 'src/store/AuthStore';
import UsersStore from 'src/store/UsersStore';
import TeamsStore from 'src/store/TeamsStore';
import TeamActivitiesStore from 'src/store/TeamActivitiesStore';
import ActivityImagesStore from 'src/store/ActivityImagesStore';
import { NavigationPropTypes } from 'src/util/PropTypes';
import { Select, MultiSelect } from 'src/components/common/Select';
import AppScreen from 'src/components/app/AppScreen';
import Sidebar from './Sidebar';
import AddPhotoCta from './AddPhotoCta';
import ActivityFeedList from './ActivityFeedList';
import ActivityFeedPlaceholder from './ActivityFeedList/Placeholder';

const ACTION_BUTTONS = [
  { text: 'Camera Roll', icon: 'photos' },
  { text: 'Take Photo', icon: 'camera' },
  { text: 'Cancel', icon: 'close' },
];

const CANCEL_INDEX = 2;

const SELECT_ITEMS = [
  { id: 1, label: 'Graham McCulloch' },
  { id: 2, label: 'James Duncan' },
  { id: 3, label: 'Johnny Hausman' },
  { id: 4, label: 'Ric Poolman' },
  { id: 5, label: 'Joshua Chan' },
  { id: 6, label: 'Wongpratan' },
  { id: 7, label: 'Isaac Schubert' },
];

@inject('auth', 'users', 'activityImages', 'teams', 'teamActivities')
@observer
class ActivityFeedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempItem: undefined,
      tempItems: [],
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

  openActionSheet = () => {
    ActionSheet.show(
      {
        options: ACTION_BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: 'Add a photo',
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          this.props.navigation.navigate(AppScreen.Photos);
        } else if (buttonIndex === 1) {
          this.props.navigation.navigate(AppScreen.Camera);
        }
      }
    );
  };

  render() {
    const { users, teams, teamActivities, activityImages } = this.props;
    const loading = users.isBusy || teams.isBusy || teamActivities.isBusy || activityImages.isBusy;
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
          {loading ? <ActivityFeedPlaceholder /> : <ActivityFeedList />}
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

// <Item stackedLabel>
//   <Label>Tagged person</Label>
//   <Select
//     modalHeader="Set tagged person"
//     displayKey="label"
//     items={SELECT_ITEMS}
//     selectedItem={this.state.tempItem}
//     onSelectedItemChange={item => {
//       this.setState({ tempItem: item });
//     }}
//   />
// </Item>
// <Item stackedLabel>
//   <Label>Tagged people</Label>
//   <MultiSelect
//     modalHeader="Tag people"
//     displayKey="label"
//     items={SELECT_ITEMS}
//     selectedItems={this.state.tempItems}
//     onSelectedItemsChange={items => {
//       this.setState({ tempItems: items });
//     }}
//   />
// </Item>
// <Item stackedLabel>
//   <Label>Test</Label>
//   <Input placeholder="Testing" />
// </Item>
