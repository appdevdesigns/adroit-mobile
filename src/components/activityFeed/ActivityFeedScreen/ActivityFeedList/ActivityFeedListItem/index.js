import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import Api from 'src/util/api';
import { View, Image } from 'react-native';
import { ListItem, Text, Left, Body, Right, Icon } from 'native-base';
import styles from '../style';

const statusStyles = {
  approved: styles.approvedImage,
  ready: styles.approvedImage,
  new: styles.newImage,
  denied: styles.deniedImage,
};

const ActivityFeedListItem = ({ item, onPress }) => {
  // Currently only denied images can be edited
  const editable = item.status === 'denied';
  const statusStyle = statusStyles[item.status] || styles.newImage;
  return (
    <ListItem key={item.id} style={styles.listItem} onPress={editable ? onPress : undefined}>
      <Left style={styles.left}>
        <View style={[styles.imageWrapper, statusStyle]}>
          <Text style={styles.date}>{format(item.date, 'MMM Do')}</Text>
          <Image style={styles.thumbnail} source={{ uri: `${Api.urls.base}${item.image}` }} />
        </View>
      </Left>
      <Body style={styles.body}>
        {!!item.activity && (
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.activity}>
            {item.activity.activity_name}
          </Text>
        )}
        {!!item.activity && (
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.team}>
            {item.activity.team.MinistryDisplayName}
          </Text>
        )}
        <Text ellipsizeMode="tail" numberOfLines={3} style={styles.caption}>
          {item.caption}
        </Text>
      </Body>
      {editable && (
        <Right>
          <Icon type="FontAwesome" name="chevron-right" />
        </Right>
      )}
    </ListItem>
  );
};

ActivityFeedListItem.propTypes = {
  item: PropTypes.shape().isRequired, // TODO
  onPress: PropTypes.func.isRequired,
};

export default ActivityFeedListItem;
