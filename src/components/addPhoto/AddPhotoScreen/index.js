import React from 'react';
import PropTypes from 'prop-types';
import intersectionBy from 'lodash-es/intersectionBy';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { when } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Image, View, AsyncStorage, Keyboard, SafeAreaView } from 'react-native';
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
  Footer,
  FooterTab,
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
import baseStyles, { round } from 'src/assets/style';
import BackButton from 'src/components/common/BackButton';
import UsersStore from 'src/store/UsersStore';
import TeamsStore from 'src/store/TeamsStore';
import ActivityImagesStore from 'src/store/ActivityImagesStore';
import Copy from 'src/assets/Copy';
import LocationsStore from 'src/store/LocationsStore';
import { PostStatus } from 'src/store/ResourceStore';
import { NavigationPropTypes } from 'src/util/PropTypes';
import Monitoring from 'src/util/Monitoring';
import { format } from 'src/util/date';
import Api from 'src/util/api';
import ConfirmationModal from './ConfirmationModal';
import PhotoUploadPreview from './PhotoUploadPreview';
import styles from './style';

const MAX_CAPTION_CHARS = 240;

const PHOTO_LOCATION = { name: Copy.photoLocation };

@inject('teams', 'activityImages', 'users', 'locations')
@observer
class AddPhotoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      caption: '',
      date: undefined,
      location: undefined,
      photoLocation: undefined,
      fetchingLocation: true,
      taggedPeople: [],
      team: undefined,
      activity: undefined,
      isModalOpen: false,
      isFooterVisible: true,
    };
    when(
      () => this.props.activityImages.uploadStatus === PostStatus.succeeded,
      () => {
        this.closeConfirmation();
        this.props.navigation.popToTop();
        this.props.activityImages.initializeUpload();
      }
    );
    when(
      () => this.props.activityImages.uploadStatus === PostStatus.failed,
      () => {
        this.closeConfirmation();
      }
    );
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }

  async componentDidMount() {
    this.initTeamActivities(this.props);
    const imageUri = this.image().uri;
    const today = new Date();
    Exif.getExif(imageUri)
      .then(data => {
        if (data.exif && data.exif.DateTime) {
          try {
            const formattedDate = data.exif.DateTime.replace(':', '-').replace(':', '-');
            const date = parse(formattedDate);
            this.setState({ date });
          } catch (err) {
            Monitoring.exception(err, { data, problem: 'Failed to parse exif data' });
            this.setState({ date: today });
          }
        } else {
          Monitoring.debug('No exif data available');
          this.setState({ date: today });
        }
      })
      .catch(msg => {
        Monitoring.exception(msg, { problem: 'Exif.getExif ERROR' });
        this.setState({ date: today });
      });
    Exif.getLatLong(imageUri)
      .then(({ latitude, longitude }) => {
        if (latitude && longitude) {
          // Temp:
          // latitude = 18.732084;
          // longitude = 98.9349063;
          Geocode.fromLatLng(String(latitude), String(longitude)).then(
            response => {
              const addrToUse = Math.max(0, Math.min(1, response.results.length - 1));
              const address = response.results[addrToUse].formatted_address;
              this.setState({ photoLocation: address, location: PHOTO_LOCATION, fetchingLocation: false });
            },
            error => {
              Monitoring.exception(error, { latitude, longitude, problem: 'Geocode.fromLatLng error' });
              this.setState({ fetchingLocation: false });
            }
          );
        } else {
          Monitoring.debug(`Exif photo lat/long ignored: ${latitude}, ${longitude}`);
          this.setState({ fetchingLocation: false });
        }
      })
      .catch(msg => {
        Monitoring.exception(msg, { problem: 'Exif.getLatLong error' });
        this.setState({ fetchingLocation: false });
      });
  }

  componentDidUpdate(nextProps) {
    this.initTeamActivities(nextProps);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow = () => {
    this.setState({ isFooterVisible: false });
  };

  keyboardDidHide = () => {
    this.setState({ isFooterVisible: true });
  };

  initTeamActivities = async props => {
    const { team } = this.state;
    const { teams } = props;
    let initTeam = team;
    if (!team && teams.list && teams.list.length) {
      const lastTeamId = await AsyncStorage.getItem('last_team_id');
      if (lastTeamId) {
        initTeam = teams.list.find(t => String(t.IDMinistry) === lastTeamId);
      }
      if (initTeam) {
        this.setTeam(initTeam);
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
    const newLocation = await this.props.locations.addUserLocation({ name: location });
    this.setState({ location: newLocation });
  };

  setStateItem = item => value => {
    this.setState({ [item]: value });
  };

  setTeam = team => {
    const { users } = this.props;
    const prevTeam = this.state.team;
    const newState = {
      team,
    };
    if (!prevTeam && users && users.me) {
      const me = team.members.slice().find(m => m.IDPerson === users.me.id);
      if (me) {
        newState.taggedPeople = [me];
      }
    } else if (prevTeam && prevTeam.IDMinistry !== team.IDMinistry) {
      newState.activity = undefined;
      newState.taggedPeople = intersectionBy(this.state.taggedPeople || [], team.members.slice() || [], 'IDPerson');
    }
    this.setState(newState);
  };

  upload = async () => {
    const { team, activity, caption, location, date, taggedPeople, photoLocation } = this.state;
    const { activityImages } = this.props;
    // Persist the team for initialization next time
    await AsyncStorage.setItem('last_team_id', String(team.IDMinistry));

    const activityImage = {
      image: this.image(),
      activityId: activity.id,
      caption,
      date,
      location: location === PHOTO_LOCATION ? photoLocation : location.name,
      taggedPeopleIds: taggedPeople.map(p => p.IDPerson),
    };
    activityImages.upload(activityImage);
  };

  image() {
    return this.props.navigation.state.params.image;
  }

  renderTeamMember = person => (
    <View style={styles.teamMember}>
      {!person.avatar || person.avatar.startsWith('images') ? (
        <View style={[styles.avatar, styles.avatarIconWrapper]}>
          <Icon style={styles.avatarIcon} type="FontAwesome" name="user" />
        </View>
      ) : (
        <Image style={round(24)} source={{ uri: Api.absoluteUrl(person.avatar) }} />
      )}
      <Text style={selectStyles.item}>{person.display_name}</Text>
    </View>
  );

  renderSelectedTeamMembers = items =>
    items.map(person => (
      <View key={person.IDPerson} style={baseStyles.tag}>
        <View style={baseStyles.tagImageWrapper}>
          {!person.avatar || person.avatar.startsWith('images') ? (
            <Icon style={baseStyles.tagAvatarIcon} type="FontAwesome" name="user" />
          ) : (
            <Image style={baseStyles.tagImage} source={{ uri: Api.absoluteUrl(person.avatar) }} />
          )}
        </View>
        <Text ellipsizeMode="tail" numberOfLines={1} style={baseStyles.tagText}>
          {person.display_name}
        </Text>
      </View>
    ));

  renderLocationIcon = () => (
    <FontAwesome5
      light
      style={[baseStyles.listItemIcon, baseStyles.marginRight, styles.locationIcon]}
      name="location-arrow"
    />
  );

  renderSelectedLocation = selectedLocation => {
    const locationText = selectedLocation === PHOTO_LOCATION ? this.state.photoLocation : selectedLocation.name;
    return (
      <View style={styles.row}>
        {selectedLocation === PHOTO_LOCATION && this.renderLocationIcon()}
        {locationText ? (
          <Text style={selectStyles.selected}>{locationText}</Text>
        ) : (
          <Spinner style={styles.spinner} size="small" />
        )}
      </View>
    );
  };

  renderLocationItem = location => (
    <View style={styles.centeredRow}>
      {location === PHOTO_LOCATION && this.renderLocationIcon()}
      <Text style={baseStyles.listItemText}>{location.name}</Text>
    </View>
  );

  render() {
    const { teams, activityImages, locations } = this.props;
    const {
      caption,
      date,
      location,
      team,
      activity,
      photoLocation,
      fetchingLocation,
      taggedPeople,
      isModalOpen,
      isFooterVisible,
    } = this.state;
    const isSaveEnabled = !!(
      activityImages.photo.isUploaded &&
      caption &&
      caption.length &&
      date &&
      location &&
      team &&
      activity &&
      taggedPeople.length
    );
    const allLocations = [];
    if (photoLocation) {
      allLocations.push({ title: '', data: [PHOTO_LOCATION] });
    }
    allLocations.push({ title: Copy.myLocationsSection, data: locations.authenticatedUsersLocations });
    allLocations.push({ title: Copy.fcfLocationsSection, data: locations.fcfLocations });
    return (
      <SafeAreaView style={baseStyles.safeView}>
        <Container>
          <Header>
            <Left style={baseStyles.headerLeft}>
              <BackButton />
            </Left>
            <Body style={baseStyles.headerBody}>
              <Title>{Copy.addPhotoTitle}</Title>
            </Body>
            <Right style={baseStyles.headerRight} />
          </Header>
          <Content>
            <PhotoUploadPreview image={this.image()} />
            <View style={styles.main}>
              <Item stackedLabel style={styles.item}>
                <Text style={styles.charCount}>{MAX_CAPTION_CHARS - caption.length}</Text>
                <Label style={styles.label}>{Copy.captionLabel}</Label>
                <Textarea
                  value={caption}
                  onChangeText={this.setStateItem('caption')}
                  returnKeyType="next"
                  blurOnSubmit
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  rowSpan={3}
                  style={styles.input}
                  maxLength={MAX_CAPTION_CHARS}
                  placeholder={Copy.captionPlaceholder}
                  placeholderTextColor="#999"
                />
              </Item>
              <Item stackedLabel style={styles.item}>
                <Label style={styles.label}>{Copy.dateLabel}</Label>
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
                    textStyle={styles.date}
                    animationType="fade"
                    androidMode="default"
                    onDateChange={this.setStateItem('date')}
                  />
                )}
              </Item>
              <Item stackedLabel style={styles.item}>
                <Label style={styles.label}>{Copy.locationLabel}</Label>
                {fetchingLocation ? (
                  <Spinner style={styles.spinner} size="small" />
                ) : (
                  <Select
                    style={styles.input}
                    filterable
                    uniqueKey="name"
                    displayKey="name"
                    modalHeader={Copy.locationModalHeader}
                    placeholder={Copy.locationPlaceholder}
                    selectedItem={location}
                    onSelectedItemChange={this.setStateItem('location')}
                    onAddOption={this.addLocation}
                    items={allLocations}
                    renderSelectedItem={this.renderSelectedLocation}
                    renderItem={this.renderLocationItem}
                    isSectioned
                    filterPlaceholder={Copy.selectLocationFilterPlaceholder}
                  />
                )}
              </Item>
              <Item stackedLabel style={styles.item}>
                <Label style={styles.label}>{Copy.teamLabel}</Label>
                {teams.loading || !teams.list ? (
                  <Spinner style={[styles.input, styles.spinner]} size="small" />
                ) : (
                  <Select
                    style={styles.input}
                    uniqueKey="IDMinistry"
                    displayKey="MinistryDisplayName"
                    modalHeader={Copy.teamModalHeader}
                    placeholder={Copy.teamPlaceholder}
                    selectedItem={team}
                    onSelectedItemChange={this.setTeam}
                    items={teams.list}
                  />
                )}
              </Item>
              <Item stackedLabel style={styles.item}>
                <Label style={styles.label}>{Copy.activityLabel}</Label>
                {teams.loading || !teams.list ? (
                  <Spinner style={[styles.input, styles.spinner]} size="small" />
                ) : (
                  <Select
                    style={styles.input}
                    uniqueKey="id"
                    displayKey="activity_name"
                    modalHeader={Copy.activityModalHeader}
                    placeholder={Copy.activityPlaceholder}
                    emptyListTitle={Copy.selectActivityEmptyTitle}
                    emptyListMessage={Copy.selectActivityEmptyMessage}
                    selectedItem={activity}
                    onSelectedItemChange={this.setStateItem('activity')}
                    items={team ? team.activities.slice() : []}
                  />
                )}
              </Item>
              <Item stackedLabel style={styles.item}>
                <Label style={styles.label}>{Copy.taggedPeopleLabel}</Label>
                {teams.loading || !teams.list ? (
                  <Spinner style={[styles.input, styles.spinner]} size="small" />
                ) : (
                  <MultiSelect
                    style={styles.input}
                    items={team ? team.members.slice() : []}
                    selectedItems={taggedPeople}
                    uniqueKey="IDPerson"
                    displayKey="display_name"
                    placeholder={Copy.taggedPeoplePlaceholder}
                    modalHeader={Copy.taggedPeopleModalHeader}
                    emptyListTitle={Copy.selectTaggedPeopleEmptyTitle}
                    emptyListMessage={Copy.selectTaggedPeopleEmptyMessage}
                    onSelectedItemsChange={this.setStateItem('taggedPeople')}
                    renderItem={this.renderTeamMember}
                    renderSelectedItems={this.renderSelectedTeamMembers}
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
          {isFooterVisible && (
            <Footer>
              <FooterTab>
                <Button active full disabled={!isSaveEnabled} onPress={this.openConfirmation}>
                  <Text>{Copy.addPhotoSaveButtonText}</Text>
                </Button>
              </FooterTab>
            </Footer>
          )}
        </Container>
      </SafeAreaView>
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
