import React from 'react';
import Placeholder from 'rn-placeholder';
import { View } from 'react-native';
import { Left, Body } from 'native-base';
import styles from './style';
import activityListStyles, { imageWrapperSize, teamFontSize, activityFontSize } from '../style';

const animate = 'fade';

const PlaceholderListItem = () => (
  <View style={activityListStyles.listItem}>
    <Left style={activityListStyles.left}>
      <Placeholder.Media size={imageWrapperSize} style={activityListStyles.imageWrapper} animate={animate} />
    </Left>
    <Body style={[activityListStyles.body, styles.body]}>
      <View style={styles.activity}>
        <Placeholder.Line textSize={activityFontSize} animate={animate} />
      </View>
      <View style={styles.team}>
        <Placeholder.Line textSize={teamFontSize} animate={animate} />
      </View>
    </Body>
  </View>
);

export default PlaceholderListItem;
