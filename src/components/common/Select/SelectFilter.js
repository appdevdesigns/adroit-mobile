import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Input, Icon, Button, ListItem, Body, Right } from 'native-base';
import baseStyles from 'src/assets/style';
import Copy from 'src/assets/Copy';
import Fade from 'src/components/common/Fade';
import styles from './style';

const SelectFilter = ({ value, onChangeText, placeholder, visible }) =>
  visible ? (
    <ListItem style={[baseStyles.unbordered, styles.filterListItem]}>
      <Body style={styles.filterWrapper}>
        <View style={styles.filterIconWrapper}>
          <Icon style={baseStyles.listItemIcon} type="FontAwesome" name="search" />
        </View>
        <Input style={styles.filterInput} placeholder={placeholder} onChangeText={onChangeText} value={value} />
      </Body>
      <Right>
        <Fade visible={!!value}>
          <Button small style={baseStyles.doublMarginLeft} transparent dark onPress={() => onChangeText('')}>
            <Icon name="times" type="FontAwesome" style={baseStyles.subtleIcon} />
          </Button>
        </Fade>
      </Right>
    </ListItem>
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
