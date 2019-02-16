import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Icon, Text, Button } from 'native-base';
import Copy from 'src/assets/Copy';
import NonIdealState from 'src/components/common/NonIdealState';
import styles from './style';

const SelectEmptyState = ({ filterable, filter, noMatchesCta, addOption, emptyListTitle, emptyListMessage }) =>
  filterable && filter ? (
    <View style={styles.noMatches}>
      <Text>{Copy.couldNotFind}</Text>
      <Text style={styles.filterCopy}>{`"${filter}"`}</Text>
      {addOption && (
        <Button iconLeft style={styles.noMatchesButton} primary onPress={addOption}>
          <Icon type="FontAwesome" name="plus" />
          <Text>{noMatchesCta}</Text>
        </Button>
      )}
    </View>
  ) : (
    <NonIdealState title={emptyListTitle} message={emptyListMessage} />
  );

SelectEmptyState.propTypes = {
  filterable: PropTypes.bool,
  filter: PropTypes.string,
  noMatchesCta: PropTypes.string,
  addOption: PropTypes.func,
  emptyListTitle: PropTypes.string,
  emptyListMessage: PropTypes.string,
};

SelectEmptyState.defaultProps = {
  filterable: false,
  filter: '',
  noMatchesCta: Copy.add,
  addOption: null,
  emptyListTitle: Copy.nonIdealState.defaultEmptySelect.title,
  emptyListMessage: Copy.nonIdealState.defaultEmptySelect.message,
};

export default SelectEmptyState;
