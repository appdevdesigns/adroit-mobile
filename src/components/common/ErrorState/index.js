import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, Icon } from 'native-base';
import styles from './style';

const ErrorState = ({ title, message, iconName, iconType }) => (
  <View style={styles.container}>
    {iconName ? <Icon style={styles.icon} type={iconType} name={iconName} /> : null}
    <Text style={styles.title}>{title}</Text>
    {message ? <Text style={styles.message}>{message}</Text> : null}
  </View>
);

ErrorState.propTypes = {
  title: PropTypes.string.isRequired,
  iconName: PropTypes.string,
  iconType: PropTypes.string,
  message: PropTypes.string,
};

ErrorState.defaultProps = {
  iconName: undefined,
  iconType: undefined,
  message: undefined,
};

export default ErrorState;
