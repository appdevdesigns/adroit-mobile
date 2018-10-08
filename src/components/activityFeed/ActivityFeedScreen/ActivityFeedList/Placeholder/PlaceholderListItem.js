import React from 'react';
import Placeholder from 'rn-placeholder';
import { View } from 'react-native';
import { Left, Body } from 'native-base';
import styles from './style';
import activityFeedStyles from '../../style';

const animate = 'fade';

const PlaceholderListItem = () => (
  <View style={activityFeedStyles.listItem}>
    <Left style={activityFeedStyles.left}>
      <Placeholder.Media size={86} style={activityFeedStyles.imageWrapper} animate={animate} />
    </Left>
    <Body style={[activityFeedStyles.body, styles.body]}>
      <View style={styles.activity}>
        <Placeholder.Line textSize={12} animate={animate} />
      </View>
      <View style={styles.team}>
        <Placeholder.Line textSize={12} animate={animate} />
      </View>
      <View style={styles.caption}>
        <Placeholder.Paragraph textSize={12} lineNumber={3} lineSpacing={3} animate={animate} />
      </View>
    </Body>
  </View>
);

export default PlaceholderListItem;
