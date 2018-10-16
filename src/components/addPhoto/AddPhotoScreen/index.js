import React from 'react';
import PropTypes from 'prop-types';
import unionBy from 'lodash-es/unionBy';
import { inject, observer } from 'mobx-react';
import { Image, View } from 'react-native';
import Exif from 'react-native-exif';
import Geocode from 'react-geocode';
import parse from 'date-fns/parse';
import {
  Container,
  Header,
  Title,
  Content,
  Left,
  Body,
  Right,
  Button,
  Spinner,
  Textarea,
  DatePicker,
  Input,
  Text,
  Item,
  Label,
} from 'native-base';
import { MultiSelect, Select } from 'src/components/common/Select';
import BackButton from 'src/components/common/BackButton';
import UsersStore from 'src/store/UsersStore';
import TeamsStore from 'src/store/TeamsStore';
import ActivityImagesStore from 'src/store/ActivityImagesStore';
import TeamActivitiesStore from 'src/store/TeamActivitiesStore';
import { NavigationPropTypes } from 'src/util/PropTypes';
import { format } from 'src/util/date';
import styles from './style';

const MAX_CAPTION_CHARS = 240;

@inject('teams', 'teamActivities', 'users', 'activityImages')
@observer
class AddPhotoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      caption: '',
      date: undefined,
      location: undefined,
      fetchingLocation: true,
      taggedPeople: [],
      team: undefined,
      activity: undefined,
    };
  }

  async componentDidMount() {
    this.initTeamActivities(this.props);
    Exif.getExif(this.props.navigation.state.params.image.uri)
      .then(data => {
        if (data.exif && data.exif.DateTime) {
          try {
            const formattedDate = data.exif.DateTime.replace(':', '-').replace(':', '-');
            const date = parse(formattedDate);
            this.setState({ date });
          } catch (err) {
            console.log('Failed to parse exif date', err);
            this.setState({ date: new Date() });
          }
        }
      })
      .catch(msg => {
        console.log('getExif ERROR', msg);
        this.setState({ date: new Date() });
      });
    Exif.getLatLong(this.props.navigation.state.params.image.uri)
      .then(({ latitude, longitude }) => {
        console.log(`Photo lat/long ignored: ${latitude}, ${longitude}`);
        // Temp:
        latitude = 18.732084;
        longitude = 98.9349063;
        Geocode.fromLatLng(String(latitude), String(longitude)).then(
          response => {
            const address = response.results[0].formatted_address;
            console.log('Address', address, response.results);
            if (!this.state.location) {
              this.setState({ location: address, fetchingLocation: false });
            }
          },
          error => {
            console.log('fromLatLng ERROR', error);
            this.setState({ fetchingLocation: false });
          }
        );
      })
      .catch(msg => {
        console.log('getLatLong ERROR', msg);
        this.setState({ fetchingLocation: false });
      });
  }

  componentDidUpdate(nextProps) {
    this.initTeamActivities(nextProps);
  }

  initTeamActivities = props => {
    const { team, activity, taggedPeople } = this.state;
    const { teams, teamActivities, users } = props;
    let initTeam = team;
    if (!team && teams.list && teams.list.length) {
      initTeam = teams.list[0];
      this.setState({ team: initTeam });
    }
    if (!activity && initTeam && teamActivities && teamActivities.map && teamActivities.map.size) {
      teamActivities.map.forEach(a => {
        if (a.team === initTeam.IDMinistry) {
          this.setState({ activity: a });
        }
      });
    }
    if (!taggedPeople.length && users.list && users.list.length && users.me.id) {
      // Tag yourself by default
      this.setState({ taggedPeople: [users.getUserById(users.me.id)] });
    }
  };

  setCaption = caption => {
    this.setState({ caption });
  };

  setDate = date => {
    this.setState({ date });
  };

  setLocation = location => {
    this.setState({ location });
  };

  setTeam = team => {
    const prevTeam = this.state.team;
    const newState = {
      team,
    };
    if (prevTeam.IDMinistry !== team.IDMinistry) {
      newState.activity = undefined;
      const newTeamMembers = this.props.teams.getTeamMembers(team.IDMinistry);
      newState.taggedPeople = unionBy(this.state.taggedPeople || [], newTeamMembers, 'IDPerson');
    }
    this.setState(newState);
  };

  setActivity = activity => {
    this.setState({ activity });
  };

  setTaggedPeople = taggedPeople => {
    this.setState({ taggedPeople });
  };

  upload = () => {
    console.log('Uploading!');
  };

  render() {
    const { navigation, teams, teamActivities, users, activityImages } = this.props;
    const { caption, date, location, team, activity, fetchingLocation, taggedPeople } = this.state;
    const { image } = navigation.state.params;
    const teamScopedActivites = teamActivities.isBusy ? undefined : [];
    if (!teamActivities.isBusy) {
      teamActivities.map.forEach(a => {
        if (!team || a.team === team.IDMinistry) {
          teamScopedActivites.push(a);
        }
      });
    }
    const userItems = team ? teams.getTeamMembers(team.IDMinistry) : [];
    return (
      <Container>
        <Header>
          <Left>
            <BackButton />
          </Left>
          <Body>
            <Title>Add a photo</Title>
          </Body>
          <Right>
            <Button transparent onPress={this.upload}>
              <Text>Save</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <Image source={{ uri: image.uri }} style={styles.image} />
          <View style={styles.main}>
            <Item stackedLabel style={styles.item}>
              <Text style={styles.charCount}>{MAX_CAPTION_CHARS - caption.length}</Text>
              <Label>Caption</Label>
              <Textarea
                value={caption}
                onChangeText={this.setCaption}
                rowSpan={3}
                style={[styles.input, styles.textArea]}
                maxLength={MAX_CAPTION_CHARS}
                placeholder="Describe what you did and why it helps local Thais..."
                placeholderTextColor="#999"
              />
            </Item>
            <Item stackedLabel style={styles.item}>
              <Label>Date</Label>
              {!date ? (
                <Spinner style={styles.spinner} size="small" />
              ) : (
                <DatePicker
                  style={styles.input}
                  defaultDate={date}
                  minimumDate={activityImages.currentReportingPeriod.start}
                  maximumDate={new Date()}
                  locale="en"
                  formatChosenDate={d => format(d, 'Do MMM')}
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType="fade"
                  androidMode="default"
                  onDateChange={this.setDate}
                />
              )}
            </Item>
            <Item stackedLabel style={styles.item}>
              <Label>Location</Label>
              {fetchingLocation ? (
                <Spinner style={styles.spinner} size="small" />
              ) : (
                <Input
                  style={[styles.input, styles.textInput]}
                  value={location}
                  placeholder="Current location"
                  placeholderTextColor="#999"
                  onChangeText={this.setLocation}
                />
              )}
            </Item>
            <Item stackedLabel style={styles.item}>
              <Label>Team</Label>
              {teams.loading || !teams.list ? (
                <Spinner style={[styles.input, styles.spinner]} size="small" />
              ) : (
                <Select
                  uniqueKey="IDMinistry"
                  displayKey="MinistryDisplayName"
                  modalHeader="Select Team"
                  placeholder="Select Team..."
                  selectedItem={team}
                  onSelectedItemChange={this.setTeam}
                  items={teams.list}
                />
              )}
            </Item>
            <Item stackedLabel style={styles.item}>
              <Label>Activity</Label>
              {!teamScopedActivites ? (
                <Spinner style={[styles.input, styles.spinner]} size="small" />
              ) : (
                <Select
                  uniqueKey="id"
                  displayKey="activity_name"
                  modalHeader="Select Activity"
                  placeholder="Select Activity..."
                  selectedItem={activity}
                  onSelectedItemChange={this.setActivity}
                  items={teamScopedActivites}
                />
              )}
            </Item>
            <Item stackedLabel style={styles.item}>
              <Label>Tagged People</Label>
              {users.loading || !userItems ? (
                <Spinner style={[styles.input, styles.spinner]} size="small" />
              ) : (
                <MultiSelect
                  items={userItems}
                  selectedItems={taggedPeople}
                  uniqueKey="IDPerson"
                  displayKey="display_name"
                  placeholder="Tag team members..."
                  modalHeader="Select team members"
                  onSelectedItemsChange={this.setTaggedPeople}
                />
              )}
            </Item>
          </View>
        </Content>
      </Container>
    );
  }
}

AddPhotoScreen.propTypes = {
  navigation: NavigationPropTypes.isRequired,
};

AddPhotoScreen.defaultProps = {};

AddPhotoScreen.wrappedComponent.propTypes = {
  teamActivities: PropTypes.instanceOf(TeamActivitiesStore).isRequired,
  teams: PropTypes.instanceOf(TeamsStore).isRequired,
  users: PropTypes.instanceOf(UsersStore).isRequired,
  activityImages: PropTypes.instanceOf(ActivityImagesStore).isRequired,
};

export default AddPhotoScreen;
