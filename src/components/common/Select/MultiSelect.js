import React from 'react';
import PropTypes from 'prop-types';
import reject from 'lodash-es/reject';
import { View, TouchableOpacity, Modal, FlatList, Keyboard } from 'react-native';
import {
  Button,
  Icon,
  Text,
  Input,
  ListItem,
  Container,
  Title,
  Content,
  Footer,
  FooterTab,
  Right,
  Body,
} from 'native-base';
import baseStyles from 'src/assets/style';
import Copy from 'src/assets/Copy';
import NonIdealState from 'src/components/common/NonIdealState';
import { filterItems } from './SelectUtil';
import styles from './style';

class MultiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      filter: '',
    };
  }

  openModal = () => {
    this.setState({ isModalOpen: true, filter: '' });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  setFilter = filter => {
    this.setState({ filter });
  };

  isSelected = item => !!this.props.selectedItems.find(i => i[this.props.uniqueKey] === item[this.props.uniqueKey]);

  removeItem = item => {
    const { uniqueKey, onSelectedItemsChange } = this.props;
    onSelectedItemsChange(reject(this.props.selectedItems, i => item[uniqueKey] === i[uniqueKey]));
  };

  addItem = item => {
    const { onSelectedItemsChange } = this.props;
    onSelectedItemsChange(this.props.selectedItems.concat([item]));
  };

  toggleItem = item => {
    if (this.props.clearFilterOnToggleItem) {
      Keyboard.dismiss();
      this.setFilter('');
    }
    if (this.isSelected(item)) {
      this.removeItem(item);
    } else {
      this.addItem(item);
    }
  };

  keyExtractor = item => String(item[this.props.uniqueKey]);

  renderSelectedItems = items => (
    <Text style={styles.selected}>{items.map(item => item[this.props.displayKey]).join(', ')}</Text>
  );

  renderPlaceholder = () => <Text style={styles.placeholder}>{this.props.placeholder}</Text>;

  renderItem = ({ item }) => {
    const { uniqueKey, renderItem, displayKey } = this.props;
    const itemIcon = this.isSelected(item) ? 'check-square' : 'square-o';
    return (
      <ListItem
        key={item[uniqueKey]}
        onPress={() => {
          this.toggleItem(item);
        }}
      >
        <Body>{renderItem ? renderItem(item) : <Text style={styles.item}>{item[displayKey]}</Text>}</Body>
        <Right>
          <Icon style={styles.itemIcon} type="FontAwesome" name={itemIcon} />
        </Right>
      </ListItem>
    );
  };

  render() {
    const {
      style,
      renderSelectedItems,
      selectedItems,
      items,
      filterable,
      filterPlaceholder,
      displayKey,
      modalHeader,
      emptyListTitle,
      emptyListMessage,
    } = this.props;
    const { isModalOpen, filter } = this.state;
    const renderSelected = renderSelectedItems || this.renderSelectedItems;

    const filtered = allItems => {
      if (filter) {
        return filterItems(filter, allItems, displayKey);
      }
      return allItems;
    };

    return (
      <TouchableOpacity onPress={this.openModal} style={[styles.wrapper, style]}>
        <View style={styles.selectedWrapper}>
          {selectedItems.length ? renderSelected(selectedItems) : this.renderPlaceholder()}
        </View>
        <Icon type="FontAwesome" name="caret-down" style={styles.icon} />
        <Modal animationType="slide" visible={isModalOpen} onRequestClose={this.closeModal}>
          <Container>
            <View style={[baseStyles.manualHeader, styles.header]}>
              <Body style={baseStyles.headerBody}>
                <Title>{modalHeader}</Title>
              </Body>
            </View>
            <Content>
              {filterable && (
                <View style={[baseStyles.listItem, baseStyles.unbordered]}>
                  <Input
                    style={styles.filterInput}
                    placeholder={filterPlaceholder}
                    onChangeText={this.setFilter}
                    value={filter}
                  />
                  <Icon
                    style={[baseStyles.listItemIcon, baseStyles.marginLeft, baseStyles.doubleMarginRight]}
                    type="FontAwesome"
                    name="search"
                  />
                </View>
              )}
              <FlatList
                keyboardShouldPersistTaps="always"
                extraData={selectedItems}
                data={filtered(items)}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                ListEmptyComponent={
                  filterable && filter ? (
                    <View style={styles.noMatches}>
                      <Text>{Copy.couldNotFind}</Text>
                      <Text style={styles.filterCopy}>{`"${filter}"`}</Text>
                    </View>
                  ) : (
                    <NonIdealState title={emptyListTitle} message={emptyListMessage} />
                  )
                }
              />
            </Content>
            <Footer>
              <FooterTab>
                <Button active full dark onPress={this.closeModal} style={styles.doneButton}>
                  <Text>{Copy.done}</Text>
                </Button>
              </FooterTab>
            </Footer>
          </Container>
        </Modal>
      </TouchableOpacity>
    );
  }
}

MultiSelect.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  uniqueKey: PropTypes.string,
  placeholder: PropTypes.string,
  displayKey: PropTypes.string,
  modalHeader: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedItems: PropTypes.arrayOf(PropTypes.shape()),
  onSelectedItemsChange: PropTypes.func.isRequired,
  renderSelectedItems: PropTypes.func,
  renderItem: PropTypes.func,
  filterable: PropTypes.bool,
  filterPlaceholder: PropTypes.string,
  clearFilterOnToggleItem: PropTypes.bool,
  emptyListTitle: PropTypes.string,
  emptyListMessage: PropTypes.string,
};

MultiSelect.defaultProps = {
  style: undefined,
  selectedItems: [],
  placeholder: Copy.defaultSelectPlaceholder,
  uniqueKey: 'id',
  displayKey: 'name',
  renderItem: undefined,
  renderSelectedItems: undefined,
  filterable: false,
  filterPlaceholder: Copy.defaultSearchPlaceholder,
  clearFilterOnToggleItem: true,
  emptyListTitle: Copy.nonIdealState.defaultEmptySelect.title,
  emptyListMessage: Copy.nonIdealState.defaultEmptySelect.message,
};

export default MultiSelect;
