import React from 'react';
import { View } from 'react-native';
import PlaceholderListItem from './PlaceholderListItem';

// Note: There's an issue in the rn-placeholder components that means
// we can't iterate a list of PlaceholderListItem nodes - we have to
// explicitly list them.
const ActivityFeedPlaceholder = () => (
  <View>
    <PlaceholderListItem />
    <PlaceholderListItem />
    <PlaceholderListItem />
    <PlaceholderListItem />
    <PlaceholderListItem />
  </View>
);

export default ActivityFeedPlaceholder;
