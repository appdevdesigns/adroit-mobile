import React from 'react';
import PropTypes from 'prop-types';
import intersectionBy from 'lodash-es/intersectionBy';
import { when } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Image, View, AsyncStorage, Keyboard } from 'react-native';
import Exif from 'react-native-exif';
import parse from 'date-fns/parse';
import {
  Container,
  Content,
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
import AdroitScreen from 'src/components/common/AdroitScreen';
import AdroitHeader from 'src/components/common/AdroitHeader';
import UsersStore from 'src/store/UsersStore';
import TeamsStore from 'src/store/TeamsStore';
import ActivityImagesStore from 'src/store/ActivityImagesStore';
import DraftActivityImageStore from 'src/store/DraftActivityImageStore';
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

@inject('teams', 'activityImages', 'draft', 'users', 'locations')
@observer
class AddPhotoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      isFooterVisible: true,
    };
    when(
      () => this.props.draft.postStatus === PostStatus.succeeded,
      () => {
        this.closeConfirmation();
        this.props.navigation.popToTop();
        this.props.draft.resetUpload();
      }
    );
    when(
      () => this.props.draft.postStatus === PostStatus.failed,
      () => {
        this.closeConfirmation();
      }
    );
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }

  async componentDidMount() {
    this.initTeamActivities(this.props);
    const { draft } = this.props;
    const imageUri = draft.image.uri;
    const today = new Date();
    Exif.getExif(imageUri)
      .then(data => {
        if (data.exif && data.exif.DateTime) {
          try {
            const formattedDate = data.exif.DateTime.replace(':', '-').replace(':', '-');
            const date = parse(formattedDate);
            draft.updateDraft({ date });
          } catch (err) {
            Monitoring.exception(err, { data, problem: 'Failed to parse exif data' });
            draft.updateDraft({ date: today });
          }
        } else {
          Monitoring.debug('No exif data available');
          draft.updateDraft({ date: today });
        }
      })
      .catch(msg => {
        Monitoring.exception(msg, { problem: 'Exif.getExif ERROR' });
        draft.updateDraft({ date: today });
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

  openConfirmation = () => {
    this.setState({ isModalOpen: true });
  };

  closeConfirmation = () => {
    this.setState({ isModalOpen: false });
  };

  initTeamActivities = async props => {
    const { teams, draft } = props;
    let initTeam = draft.team;
    if (!draft.team && teams.list && teams.list.length) {
      const lastTeamId = await AsyncStorage.getItem('last_team_id');
      if (lastTeamId) {
        initTeam = teams.list.find(t => String(t.IDMinistry) === lastTeamId);
      }
      if (initTeam) {
        draft.updateDraft({ team: initTeam });
      }
    }
  };

  addLocation = async location => {
    const newLocation = await this.props.locations.addUserLocation({ name: location });
    this.props.draft.updateDraft({ location: newLocation });
  };

  setDraftProp = item => value => {
    this.props.draft.updateDraft({ [item]: value });
  };

  setTeam = team => {
    const { users, draft } = this.props;
    const prevTeam = draft.team;
    const newDraftProps = {
      team,
    };
    if (!prevTeam && users && users.me) {
      const me = team.members.slice().find(m => m.IDPerson === users.me.id);
      if (me) {
        newDraftProps.taggedPeople = [me];
      }
    } else if (prevTeam && prevTeam.IDMinistry !== team.IDMinistry) {
      newDraftProps.activity = undefined;
      newDraftProps.taggedPeople = intersectionBy(draft.taggedPeople || [], team.members.slice() || [], 'IDPerson');
    }
    draft.updateDraft(newDraftProps);
  };

  upload = async () => {
    const { draft } = this.props;
    // Persist the team for initialization next time
    await AsyncStorage.setItem('last_team_id', String(draft.team.IDMinistry));
    draft.upload();
  };

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

  renderSelectedLocation = selectedLocation => (
    <View style={styles.row}>
      <Text style={selectStyles.selected}>{selectedLocation.name}</Text>
    </View>
  );

  renderLocationItem = location => (
    <View style={styles.centeredRow}>
      <Text style={baseStyles.listItemText}>{location.name}</Text>
    </View>
  );

  render() {
    const {
      teams,
      activityImages,
      locations,
      draft: { isNew, caption, date, location, team, activity, taggedPeople, postStatus },
    } = this.props;
    const { isModalOpen, isFooterVisible } = this.state;
    const allLocations = [
      { title: Copy.myLocationsSection, data: locations.authenticatedUsersLocations },
      { title: Copy.fcfLocationsSection, data: locations.fcfLocations },
    ];
    return (
      <AdroitScreen>
        <Container>
          <AdroitHeader title={isNew ? Copy.addPhotoTitle : Copy.editPhotoTitle} />
          <Content>
            <PhotoUploadPreview />
            <View style={styles.main}>
              <Item stackedLabel style={styles.item}>
                <Text style={styles.charCount}>{MAX_CAPTION_CHARS - caption.length}</Text>
                <Label style={styles.label}>{Copy.captionLabel}</Label>
                <Textarea
                  value={caption}
                  onChangeText={this.setDraftProp('caption')}
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
                    onDateChange={this.setDraftProp('date')}
                  />
                )}
              </Item>
              <Item stackedLabel style={styles.item}>
                <Label style={styles.label}>{Copy.locationLabel}</Label>
                <Select
                  style={styles.input}
                  filterable
                  uniqueKey="name"
                  displayKey="name"
                  modalHeader={Copy.locationModalHeader}
                  placeholder={Copy.locationPlaceholder}
                  selectedItem={location}
                  onSelectedItemChange={this.setDraftProp('location')}
                  onAddOption={this.addLocation}
                  items={allLocations}
                  renderSelectedItem={this.renderSelectedLocation}
                  renderItem={this.renderLocationItem}
                  isSectioned
                  filterPlaceholder={Copy.selectLocationFilterPlaceholder}
                />
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
                    onSelectedItemChange={this.setDraftProp('activity')}
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
                    filterable
                    style={styles.input}
                    items={team ? team.members.slice() : []}
                    selectedItems={taggedPeople.slice()}
                    uniqueKey="IDPerson"
                    displayKey="display_name"
                    placeholder={Copy.taggedPeoplePlaceholder}
                    modalHeader={Copy.taggedPeopleModalHeader}
                    emptyListTitle={Copy.selectTaggedPeopleEmptyTitle}
                    emptyListMessage={Copy.selectTaggedPeopleEmptyMessage}
                    onSelectedItemsChange={this.setDraftProp('taggedPeople')}
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
              uploadStatus={postStatus}
              onCancel={this.closeConfirmation}
              onConfirm={this.upload}
              isUploading={false}
            />
          </Content>
          {isFooterVisible && (
            <Footer>
              <FooterTab>
                <Button active full disabled={!this.props.draft.isReadyForPosting} onPress={this.openConfirmation}>
                  <Text>{Copy.addPhotoSaveButtonText}</Text>
                </Button>
              </FooterTab>
            </Footer>
          )}
        </Container>
      </AdroitScreen>
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
  draft: PropTypes.instanceOf(DraftActivityImageStore).isRequired,
  locations: PropTypes.instanceOf(LocationsStore).isRequired,
};

export default AddPhotoScreen;
