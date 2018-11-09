import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import capitalize from 'lodash-es/capitalize';
import format from 'date-fns/format';
import { FlatList, View, Image } from 'react-native';
import { ListItem, Text, Left, Body, Content, Separator } from 'native-base';
import ActivityImagesStore from 'src/store/ActivityImagesStore';
import Api from 'src/util/api';
import styles from './style';
import activityFeedStyles from '../style';

@inject('activityImages')
@observer
class ActivityFeedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { activityImages } = this.props;
    const myImages = activityImages.myActivityImages;
    return myImages.length ? (
      <Content>
        <FlatList
          keyExtractor={item => String(item.id)}
          data={myImages}
          renderItem={({ item }) => {
            const statusStyle =
              item.status === 'approved' || item.status === 'ready' ? styles.approvedImage : styles.newImage;
            return (
              <ListItem key={item.id} style={activityFeedStyles.listItem}>
                <Left style={activityFeedStyles.left}>
                  <View style={[activityFeedStyles.imageWrapper, statusStyle]}>
                    <Text style={styles.date}>{format(item.date, 'MMM Do')}</Text>
                    <Image style={styles.thumbnail} source={{ uri: `${Api.urls.base}${item.image}` }} />
                  </View>
                </Left>
                <Body style={activityFeedStyles.body}>
                  <Text ellipsizeMode="tail" style={styles.activity}>
                    {item.activity.activity_name}
                  </Text>
                  <Text ellipsizeMode="tail" style={styles.team}>
                    {item.activity.team.MinistryDisplayName}
                  </Text>
                  <Text ellipsizeMode="tail" numberOfLines={3} style={styles.caption}>
                    {item.caption}
                  </Text>
                </Body>
              </ListItem>
            );
          }}
        />
      </Content>
    ) : (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>You haven't yet been tagged in any photos for this reporting period.</Text>
      </View>
    );
  }
}

ActivityFeedList.wrappedComponent.propTypes = {
  activityImages: PropTypes.instanceOf(ActivityImagesStore).isRequired,
};

export default ActivityFeedList;
