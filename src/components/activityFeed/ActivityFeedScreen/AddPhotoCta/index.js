import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableHighlight } from 'react-native';
import { Icon, Text, Left, Body } from 'native-base';
import styles from './style';
import activityFeedStyles from '../style';

const AddPhotoCta = ({ onPress }) => (
  <TouchableHighlight onPress={onPress}>
    <View style={[activityFeedStyles.listItem, styles.container]}>
      <Left style={activityFeedStyles.left}>
        <View style={[activityFeedStyles.imageWrapper, styles.iconWrapper]}>
          <Icon style={styles.icon} type="MaterialIcons" name="add-a-photo" />
        </View>
      </Left>
      <Body style={[activityFeedStyles.body, styles.body]}>
        <Text style={styles.label}>Upload a new activity photo</Text>
      </Body>
    </View>
  </TouchableHighlight>
);

AddPhotoCta.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default AddPhotoCta;
