import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import format from 'date-fns/format';
import { View, Image } from 'react-native';
import { List, ListItem, Text, Left, Body } from 'native-base';
import ActivityImagesStore from 'src/store/ActivityImagesStore';
import TeamsStore from 'src/store/TeamsStore';
import TeamActivitiesStore from 'src/store/TeamActivitiesStore';
import Api from 'src/util/api';
import styles from './style';
import activityFeedStyles from '../style';

@inject('activityImages', 'teams', 'teamActivities')
@observer
class ActivityFeedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { activityImages, teams, teamActivities } = this.props;
    const myImages = activityImages.myActivityImages;
    return (
      <List>
        {myImages.map(image => {
          const activity = teamActivities.map.get(String(image.activity));
          const team = teams.map.get(String(activity.team)).MinistryDisplayName;
          return (
            <ListItem key={image.id} style={activityFeedStyles.listItem}>
              <Left style={activityFeedStyles.left}>
                <View style={activityFeedStyles.imageWrapper}>
                  <Text style={styles.date}>{format(image.date, 'MMM Do')}</Text>
                  <Image style={styles.thumbnail} source={{ uri: `${Api.urls.base}${image.image}` }} />
                </View>
              </Left>
              <Body style={activityFeedStyles.body}>
                <Text ellipsizeMode="tail" style={styles.activity}>
                  {activity.activity_name}
                </Text>
                <Text ellipsizeMode="tail" style={styles.team}>
                  {team}
                </Text>
                <Text ellipsizeMode="tail" numberOfLines={3} style={styles.caption}>
                  {image.caption}
                </Text>
              </Body>
            </ListItem>
          );
        })}
      </List>
    );
  }
}

ActivityFeedList.wrappedComponent.propTypes = {
  activityImages: PropTypes.instanceOf(ActivityImagesStore).isRequired,
  teams: PropTypes.instanceOf(TeamsStore).isRequired,
  teamActivities: PropTypes.instanceOf(TeamActivitiesStore).isRequired,
};

export default ActivityFeedList;
