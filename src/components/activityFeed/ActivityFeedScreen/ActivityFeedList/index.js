import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import format from 'date-fns/format';
import { FlatList, View, Image } from 'react-native';
import { ListItem, Text, Left, Body, Content } from 'native-base';
import ActivityImagesStore from 'src/store/ActivityImagesStore';
import Api from 'src/util/api';
import { CopilotView, CopilotStepPhotoList } from 'src/util/copilot';
import Copy from 'src/assets/Copy';
import NonIdealState from 'src/components/common/NonIdealState';
import styles from './style';
import ActivityFeedPlaceholder from './Placeholder';

const statusStyles = {
  approved: styles.approvedImage,
  ready: styles.approvedImage,
  new: styles.newImage,
  denied: styles.deniedImage,
};

@inject('activityImages')
@observer
class ActivityFeedList extends React.Component {
  render() {
    const {
      activityImages: { isInitialized, myActivityImages, fetchCount },
    } = this.props;
    if (!isInitialized || !myActivityImages) {
      return <ActivityFeedPlaceholder />;
    }
    return (
      <View style={styles.content}>
        <CopilotStepPhotoList>
          <CopilotView>
            <FlatList
              keyExtractor={item => String(item.id)}
              refreshing={fetchCount > 0}
              onRefresh={this.props.activityImages.getMyActivityImages}
              ListEmptyComponent={
                <NonIdealState
                  title={Copy.nonIdealState.emptyActivityList.title}
                  message={Copy.nonIdealState.emptyActivityList.message}
                />
              }
              data={myActivityImages}
              renderItem={({ item }) => {
                const statusStyle = statusStyles[item.status] || styles.newImage;
                return (
                  <ListItem key={item.id} style={styles.listItem}>
                    <Left style={styles.left}>
                      <View style={[styles.imageWrapper, statusStyle]}>
                        <Text style={styles.date}>{format(item.date, 'MMM Do')}</Text>
                        <Image style={styles.thumbnail} source={{ uri: `${Api.urls.base}${item.image}` }} />
                      </View>
                    </Left>
                    <Body style={styles.body}>
                      <Text ellipsizeMode="tail" numberOfLines={1} style={styles.activity}>
                        {item.activity.activity_name}
                      </Text>
                      <Text ellipsizeMode="tail" numberOfLines={1} style={styles.team}>
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
          </CopilotView>
        </CopilotStepPhotoList>
      </View>
    );
  }
}

ActivityFeedList.wrappedComponent.propTypes = {
  activityImages: PropTypes.instanceOf(ActivityImagesStore).isRequired,
};

export default ActivityFeedList;
