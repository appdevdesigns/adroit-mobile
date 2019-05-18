import React from 'react';
import PropTypes from 'prop-types';
import reject from 'lodash-es/reject';
import reduce from 'lodash-es/reduce';
import { View, TouchableOpacity, Modal, FlatList, SectionList, Keyboard } from 'react-native';
import {
  Button,
  Icon,
  Text,
  ListItem,
  Container,
  Title,
  Content,
  Footer,
  FooterTab,
  Right,
  Body,
  Separator,
} from 'native-base';
import baseStyles from 'src/assets/style';
import Copy from 'src/assets/Copy';
import { filterItems } from './SelectUtil';
import SelectFilter from './SelectFilter';
import SelectEmptyState from './SelectEmptyState';
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

  renderSectionHeader = ({ section: { title } }) =>
    title ? (
      <Separator style={baseStyles.separator} bordered>
        <Text>{title.toUpperCase()}</Text>
      </Separator>
    ) : null;

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
      isSectioned,
      renderSectionHeader,
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

    const emptyStateProps = {
      filterable,
      filter,
      emptyListTitle,
      emptyListMessage,
    };

    const ListComponent = isSectioned ? SectionList : FlatList;
    const listProps = {
      keyboardShouldPersistTaps: 'always',
      extraData: selectedItems,
      keyExtractor: this.keyExtractor,
      renderItem: this.renderItem,
      ItemSeparatorComponent: () => <View style={styles.separator} />,
      ListEmptyComponent: () => <SelectEmptyState {...emptyStateProps} />,
    };
    if (isSectioned) {
      listProps.sections = reduce(
        items,
        (acc, item) => {
          const filteredItems = filtered(item.data);
          if (filteredItems.length) {
            acc.push({ ...item, data: filteredItems });
          }
          return acc;
        },
        []
      );
      listProps.renderSectionHeader = renderSectionHeader || this.renderSectionHeader;
    } else {
      listProps.data = filtered(items);
    }
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
              <SelectFilter
                visible={filterable}
                value={filter}
                onChangeText={this.setFilter}
                placeholder={filterPlaceholder}
              />
              <ListComponent {...listProps} />
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
  isSectioned: PropTypes.bool,
  renderSectionHeader: PropTypes.func,
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
  clearFilterOnToggleItem: false,
  isSectioned: false,
  renderSectionHeader: undefined,
  emptyListTitle: Copy.nonIdealState.defaultEmptySelect.title,
  emptyListMessage: Copy.nonIdealState.defaultEmptySelect.message,
};

export default MultiSelect;
