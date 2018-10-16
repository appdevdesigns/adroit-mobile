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
  Icon,
} from 'native-base';
import { MultiSelect, Select } from 'src/components/common/Select';
import selectStyles from 'src/components/common/Select/style';
import BackButton from 'src/components/common/BackButton';
import UsersStore from 'src/store/UsersStore';
import TeamsStore from 'src/store/TeamsStore';
import ActivityImagesStore from 'src/store/ActivityImagesStore';
import TeamActivitiesStore from 'src/store/TeamActivitiesStore';
import LocationsStore from 'src/store/LocationsStore';
import { NavigationPropTypes } from 'src/util/PropTypes';
import { format } from 'src/util/date';
import Api from 'src/util/api';
import ConfirmationModal from './ConfirmationModal';
import styles from './style';

const MAX_CAPTION_CHARS = 240;

const PHOTO_LOCATION = { location: 'Photo location' };

@inject('teams', 'teamActivities', 'users', 'activityImages', 'locations')
@observer
class AddPhotoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      caption: '',
      date: undefined,
      location: PHOTO_LOCATION,
      currentLocation: undefined,
      fetchingLocation: true,
      taggedPeople: [],
      team: undefined,
      activity: undefined,
      isModalOpen: false,
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
            const addrToUse = Math.max(0, Math.min(1, response.results.length - 1));
            const address = response.results[addrToUse].formatted_address;
            console.log('Address', address, response.results);
            this.setState({ currentLocation: address, fetchingLocation: false });
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

  openConfirmation = () => {
    this.setState({ isModalOpen: true });
  };

  closeConfirmation = () => {
    this.setState({ isModalOpen: false });
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
    this.closeConfirmation();
  };

  renderTeamMember = person => (
    <View style={styles.teamMember}>
      {!person.avatar || person.avatar.startsWith('images') ? (
        <View style={[styles.avatar, styles.avatarIconWrapper]}>
          <Icon style={styles.avatarIcon} type="FontAwesome" name="user" />
        </View>
      ) : (
        <Image style={styles.avatar} source={{ uri: Api.absoluteUrl(person.avatar) }} />
      )}
      <Text ellipsizeMode="tail" style={selectStyles.item}>
        {person.display_name}
      </Text>
    </View>
  );

  renderSelectedLocation = selectedLocation => {
    if (selectedLocation === PHOTO_LOCATION) {
      return (
        <View style={styles.row}>
          <Icon style={styles.currentLocationIcon} type="FontAwesome" name="location-arrow" />
          {this.state.currentLocation ? (
            <Text style={selectStyles.selected}>{this.state.currentLocation}</Text>
          ) : (
            <Spinner size="small" />
          )}
        </View>
      );
    }
    return <Text style={selectStyles.selected}>{selectedLocation.location}</Text>;
  };

  renderLocationItem = location => {
    if (location === PHOTO_LOCATION) {
      return (
        <View style={styles.currentLocationItem}>
          <View style={styles.currentLocationIconWrapper}>
            <Icon style={styles.currentLocationIcon} type="FontAwesome" name="location-arrow" />
          </View>
          <Text ellipsizeMode="tail" style={selectStyles.item}>
            Current location
          </Text>
        </View>
      );
    }
    return (
      <Text ellipsizeMode="tail" style={selectStyles.item}>
        {location.location}
      </Text>
    );
  };

  render() {
    const { navigation, teams, teamActivities, users, activityImages, locations } = this.props;
    const { caption, date, location, team, activity, fetchingLocation, taggedPeople, isModalOpen } = this.state;
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
    const isSaveEnabled = caption && caption.length && date && location && team && activity && taggedPeople.length;
    const allLocations = [PHOTO_LOCATION].concat(locations.list);
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
            <Button disabled={!isSaveEnabled} transparent onPress={this.openConfirmation}>
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
                <Select
                  uniqueKey="location"
                  displayKey="location"
                  modalHeader="Photo location"
                  placeholder="Photo location..."
                  selectedItem={location}
                  onSelectedItemChange={this.setLocation}
                  items={allLocations}
                  renderSelectedItem={this.renderSelectedLocation}
                  renderItem={this.renderLocationItem}
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
                  renderItem={this.renderTeamMember}
                />
              )}
            </Item>
          </View>
          <ConfirmationModal
            visible={isModalOpen}
            caption={caption}
            taggedPeople={taggedPeople.map(m => m.display_name).join(', ')}
            onCancel={this.closeConfirmation}
            onConfirm={this.upload}
            isUploading={false}
          />
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
  locations: PropTypes.instanceOf(LocationsStore).isRequired,
};

export default AddPhotoScreen;
