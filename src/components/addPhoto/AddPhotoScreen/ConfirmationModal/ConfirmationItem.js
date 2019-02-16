import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { CheckBox, Text } from 'native-base';
import styles from './style';

const ConfirmationItem = ({ checked, toggleChecked, isUploading, label, content }) => (
  <View style={styles.item}>
    <CheckBox style={styles.checkbox} checked={checked} onPress={toggleChecked} disabled={isUploading} />
    <TouchableOpacity onPress={toggleChecked}>
      <View style={styles.itemBody}>
        <Text style={styles.label}>{label}</Text>
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.context}>{content}</Text>
        </ScrollView>
      </View>
    </TouchableOpacity>
  </View>
);

ConfirmationItem.propTypes = {
  checked: PropTypes.bool.isRequired,
  toggleChecked: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default ConfirmationItem;
