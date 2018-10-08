import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Image, View } from 'react-native';
import Exif from 'react-native-exif';
import Geocode from 'react-geocode';
import {
  Container,
  Header,
  Title,
  Content,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Spinner,
  Textarea,
  DatePicker,
  Picker,
  Input,
  Text,
} from 'native-base';
import BackButton from 'src/components/common/BackButton';
import TeamsStore from 'src/store/TeamsStore';
import TeamActivitiesStore from 'src/store/TeamActivitiesStore';
import { NavigationPropTypes } from 'src/util/PropTypes';
import styles from './style';

@inject('teams', 'teamActivities')
@observer
class AddPhotoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      caption: undefined,
      date: new Date(),
      location: undefined,
      fetchingLocation: true,
      teamId: undefined,
      activityId: undefined,
    };
  }

  async componentDidMount() {
    this.initTeamActivities(this.props);
    Exif.getLatLong(this.props.navigation.state.params.image.uri)
      .then(({ latitude, longitude }) => {
        console.log(`Photo lat/long: ${latitude}, ${longitude}`);
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
    const { teamId, activityId } = this.state;
    if (!teamId && props.teams.list && props.teams.list.length) {
      this.setState({ teamId: props.teams.list[0].IDMinistry });
    }
    if (!activityId && teamId && props.teamActivities && props.teamActivities.map && props.teamActivities.map.size) {
      props.teamActivities.map.forEach(activity => {
        if (!this.state.activityId && activity.team.IDMinistry === teamId) {
          this.setState({ activityId: activity.id });
        }
      });
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

  setTeam = teamId => {
    const prevTeamId = this.state.teamId;
    const newState = {
      teamId,
    };
    if (prevTeamId !== teamId) {
      newState.activityId = undefined;
    }
    this.setState(newState);
  };

  setActivity = activityId => {
    this.setState({ activityId });
  };

  upload = () => {
    console.log('Uploading!');
  };

  render() {
    const { navigation, teams, teamActivities } = this.props;
    const { caption, date, location, teamId, activityId, fetchingLocation } = this.state;
    const { image } = navigation.state.params;
    const teamScopedActivites = teamActivities.fetchCount ? undefined : [];
    if (!teamActivities.fetchCount) {
      teamActivities.map.forEach(activity => {
        if (!teamId || activity.team.IDMinistry === teamId) {
          teamScopedActivites.push(activity);
        }
      });
    }
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
            <View style={styles.row}>
              <View style={styles.iconWrapper}>
                <Icon style={styles.icon} type="FontAwesome" name="commenting" />
              </View>
              <Textarea
                value={caption}
                onChangeText={this.setCaption}
                style={[styles.input, styles.textArea]}
                rowSpan={3}
                placeholder="Describe what you did and why it helps local Thais..."
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.row}>
              <View style={styles.iconWrapper}>
                <Icon style={styles.icon} type="FontAwesome" name="calendar" />
              </View>
              <DatePicker
                style={[styles.input, styles.date]}
                defaultDate={date}
                minimumDate={new Date(2018, 1, 1)}
                maximumDate={new Date()}
                locale="en"
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                textStyle={{ marginTop: 4 }}
                animationType="fade"
                androidMode="default"
                onDateChange={this.setDate}
              />
            </View>
            <View style={styles.row}>
              <View style={styles.iconWrapper}>
                <Icon style={styles.icon} type="FontAwesome" name="map-marker" />
              </View>
              {fetchingLocation ? (
                <Spinner style={[styles.input, styles.spinner]} size="small" />
              ) : (
                <Input
                  style={[styles.input, styles.textInput]}
                  value={location}
                  placeholder="Current location"
                  placeholderTextColor="#999"
                  onChangeText={this.setLocation}
                />
              )}
            </View>
            <View style={styles.row}>
              <View style={styles.iconWrapper}>
                <Icon style={styles.icon} type="FontAwesome" name="address-book-o" />
              </View>
              {teams.loading || !teams.list ? (
                <Spinner style={[styles.input, styles.spinner]} size="small" />
              ) : (
                <Picker
                  note
                  mode="dialog"
                  prompt="Select Team..."
                  style={styles.input}
                  selectedValue={teamId}
                  onValueChange={this.setTeam}
                >
                  {teams.list.map(t => (
                    <Picker.Item key={t.IDMinistry} label={t.MinistryDisplayName} value={t.IDMinistry} />
                  ))}
                </Picker>
              )}
            </View>
            <View style={styles.row}>
              <View style={styles.iconWrapper}>
                <Icon style={styles.icon} type="FontAwesome" name="folder-o" />
              </View>
              {!teamScopedActivites ? (
                <Spinner style={[styles.input, styles.spinner]} size="small" />
              ) : (
                <Picker
                  note
                  mode="dialog"
                  prompt="Select Activity..."
                  style={styles.input}
                  selectedValue={activityId}
                  onValueChange={this.setActivity}
                >
                  {teamScopedActivites.map(a => (
                    <Picker.Item key={a.id} label={a.activity_name} value={a.id} />
                  ))}
                </Picker>
              )}
            </View>
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
};

export default AddPhotoScreen;
