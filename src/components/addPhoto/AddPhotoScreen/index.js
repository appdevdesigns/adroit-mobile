import React from 'react';
import PropTypes from 'prop-types';
import unionBy from 'lodash-es/unionBy';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { inject, observer } from 'mobx-react';
import { Image, View, AsyncStorage } from 'react-native';
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
  Text,
  Item,
  Label,
  Icon,
} from 'native-base';
import { MultiSelect, Select } from 'src/components/common/Select';
import selectStyles from 'src/components/common/Select/style';
import baseStyles from 'src/assets/style';
import BackButton from 'src/components/common/BackButton';
import UsersStore from 'src/store/UsersStore';
import TeamsStore from 'src/store/TeamsStore';
import ActivityImagesStore from 'src/store/ActivityImagesStore';
import LocationsStore, { LocationType, LocationIcon } from 'src/store/LocationsStore';
import { NavigationPropTypes } from 'src/util/PropTypes';
import { format } from 'src/util/date';
import Api from 'src/util/api';
import ConfirmationModal from './ConfirmationModal';
import PhotoUploadPreview from './PhotoUploadPreview';
import styles from './style';

const MAX_CAPTION_CHARS = 240;

const PHOTO_LOCATION = { location: 'Photo location', type: LocationType.GPS };

@inject('teams', 'activityImages', 'users', 'locations')
@observer
class AddPhotoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      caption: 'TEMP',
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
        } else {
          console.log('No exif data available');
          this.setState({ date: new Date() });
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

  initTeamActivities = async props => {
    const { team, activity, taggedPeople } = this.state;
    const { teams, users } = props;
    let initTeam = team;
    if (!team && teams.list && teams.list.length) {
      const lastTeamId = await AsyncStorage.getItem('last_team_id');
      if (lastTeamId) {
        initTeam = teams.list.find(t => String(t.IDMinistry) === lastTeamId);
      }
      if (!initTeam) {
        [initTeam] = teams.list;
      }
      this.setState({ team: initTeam });
    }
    if (!activity && initTeam) {
      let initActivity = activity;
      const lastActivityId = await AsyncStorage.getItem('last_activity_id');
      if (lastActivityId) {
        initActivity = initTeam.activities.find(a => String(a.id) === lastActivityId);
      }
      if (!initActivity) {
        [initActivity] = initTeam.activities;
      }
      this.setState({ activity: initActivity });
    }
    if (!taggedPeople.length && initTeam && users && users.me) {
      // Tag yourself by default
      const me = initTeam.members.find(m => m.IDPerson === users.me.id);
      if (me) {
        this.setState({ taggedPeople: [me] });
      }
    }
  };

  openConfirmation = () => {
    this.setState({ isModalOpen: true });
  };

  closeConfirmation = () => {
    this.setState({ isModalOpen: false });
  };

  addLocation = async location => {
    const newLocation = await this.props.locations.addUserLocation({ location });
    this.setLocation(newLocation);
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
      newState.taggedPeople = unionBy(this.state.taggedPeople || [], team.members, 'IDPerson');
    }
    this.setState(newState);
  };

  setActivity = activity => {
    this.setState({ activity });
  };

  setTaggedPeople = taggedPeople => {
    this.setState({ taggedPeople });
  };

  upload = async () => {
    console.log('Uploading!');
    const { team, activity, caption, location, date, taggedPeople, currentLocation } = this.state;
    const {
      activityImages,
      navigation: {
        state: {
          params: { image },
        },
      },
    } = this.props;
    this.closeConfirmation();
    // Persist the team and activity IDs for initialization next time
    await AsyncStorage.setItem('last_team_id', String(team.IDMinistry));
    await AsyncStorage.setItem('last_activity_id', String(activity.id));

    const activityImage = {
      image,
      activityId: activity.id,
      caption,
      date,
      location: location === PHOTO_LOCATION ? currentLocation : location.location,
      taggedPeopleIds: taggedPeople.map(p => p.IDPerson),
    };
    activityImages.upload(activityImage);
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
    const locationText = selectedLocation === PHOTO_LOCATION ? this.state.currentLocation : selectedLocation.location;
    const iconStyles = [baseStyles.listItemIcon, baseStyles.marginRight];
    if (selectedLocation === PHOTO_LOCATION) {
      iconStyles.push(styles.locationIcon);
    }
    return (
      <View style={styles.row}>
        <FontAwesome5 light style={iconStyles} name={LocationIcon[selectedLocation.type]} />
        {this.state.currentLocation ? (
          <Text style={selectStyles.selected}>{locationText}</Text>
        ) : (
          <Spinner size="small" />
        )}
      </View>
    );
  };

  renderLocationItem = location => {
    const iconStyles = [baseStyles.listItemIcon, baseStyles.marginRight];
    if (location === PHOTO_LOCATION) {
      iconStyles.push(styles.locationIcon);
    }
    return (
      <View style={styles.centeredRow}>
        <FontAwesome5 light style={iconStyles} name={LocationIcon[location.type]} />
        <Text ellipsizeMode="tail" style={baseStyles.listItemText}>
          {location.location}
        </Text>
      </View>
    );
  };

  render() {
    const { navigation, teams, activityImages, locations } = this.props;
    const { caption, date, location, team, activity, fetchingLocation, taggedPeople, isModalOpen } = this.state;
    const { image } = navigation.state.params;
    const isSaveEnabled =
      true ||
      (activityImages.uploadedImageName &&
        caption &&
        caption.length &&
        date &&
        location &&
        team &&
        activity &&
        taggedPeople.length);
    const allLocations = [PHOTO_LOCATION].concat(locations.orderedLocations);
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
          <PhotoUploadPreview image={image} />
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
                  filterable
                  uniqueKey="location"
                  displayKey="location"
                  modalHeader="Photo location"
                  placeholder="Photo location..."
                  selectedItem={location}
                  onSelectedItemChange={this.setLocation}
                  onAddOption={this.addLocation}
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
              {teams.loading || !teams.list ? (
                <Spinner style={[styles.input, styles.spinner]} size="small" />
              ) : (
                <Select
                  uniqueKey="id"
                  displayKey="activity_name"
                  modalHeader="Select Activity"
                  placeholder="Select Activity..."
                  selectedItem={activity}
                  onSelectedItemChange={this.setActivity}
                  items={team ? team.activities.slice() : []}
                />
              )}
            </Item>
            <Item stackedLabel style={styles.item}>
              <Label>Tagged People</Label>
              {teams.loading || !teams.list ? (
                <Spinner style={[styles.input, styles.spinner]} size="small" />
              ) : (
                <MultiSelect
                  items={team ? team.members.slice() : []}
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
  teams: PropTypes.instanceOf(TeamsStore).isRequired,
  users: PropTypes.instanceOf(UsersStore).isRequired,
  activityImages: PropTypes.instanceOf(ActivityImagesStore).isRequired,
  locations: PropTypes.instanceOf(LocationsStore).isRequired,
};

export default AddPhotoScreen;
