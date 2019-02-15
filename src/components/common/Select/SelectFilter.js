import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Input, Icon, Button } from 'native-base';
import baseStyles from 'src/assets/style';
import Copy from 'src/assets/Copy';
import Fade from 'src/components/common/Fade';
import styles from './style';

const SelectFilter = ({ value, onChangeText, placeholder, visible }) =>
  visible ? (
    <View style={[baseStyles.listItem, baseStyles.unbordered]}>
      <Icon
        style={[baseStyles.listItemIcon, baseStyles.marginRight, baseStyles.doubleMarginLeft]}
        type="FontAwesome"
        name="search"
      />
      <Input style={styles.filterInput} placeholder={placeholder} onChangeText={onChangeText} value={value} />
      <Fade visible={!!value}>
        <Button
          small
          style={[baseStyles.marginLeft, baseStyles.doubleMarginRight]}
          transparent
          dark
          onPress={() => onChangeText('')}
        >
          <Icon name="times" type="FontAwesome" style={baseStyles.subtleIcon} />
        </Button>
      </Fade>
    </View>
  ) : null;

SelectFilter.propTypes = {
  visible: PropTypes.bool,
  value: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

SelectFilter.defaultProps = {
  visible: false,
  value: '',
  placeholder: Copy.defaultSearchPlaceholder,
};

export default SelectFilter;
