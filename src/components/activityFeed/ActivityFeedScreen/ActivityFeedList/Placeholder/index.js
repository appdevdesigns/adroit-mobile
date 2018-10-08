import React from 'react';
import { View } from 'react-native';
import PlaceholderListItem from './PlaceholderListItem';

const ActivityFeedPlaceholder = () => {
  const placeholders = [...Array(5).keys()];
  return (
    <View>
      {placeholders.map(i => (
        <PlaceholderListItem key={i} />
      ))}
    </View>
  );
};

export default ActivityFeedPlaceholder;
