import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, Icon } from 'native-base';
import styles from './style';

const NonIdealState = ({ title, message, icon, children }) => (
  <View style={styles.container}>
    {icon ? <Icon type="FontAwesome" style={styles.icon} name={icon} /> : null}
    <Text style={styles.title}>{title}</Text>
    {message ? <Text style={styles.message}>{message}</Text> : null}
    {children}
  </View>
);

NonIdealState.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  message: PropTypes.string,
  children: PropTypes.node,
};

NonIdealState.defaultProps = {
  icon: undefined,
  message: undefined,
  children: undefined,
};

export default NonIdealState;
