import React from 'react';
import PropTypes from 'prop-types';
import reduce from 'lodash-es/reduce';
import { View, TouchableOpacity, Modal, FlatList, SectionList } from 'react-native';
import {
  Button,
  Icon,
  Text,
  ListItem,
  Container,
  Title,
  Content,
  Left,
  Body,
  Right,
  Separator,
  Footer,
  FooterTab,
} from 'native-base';
import baseStyles from 'src/assets/style';
import Copy from 'src/assets/Copy';
import { filterItems } from './SelectUtil';
import SelectFilter from './SelectFilter';
import SelectEmptyState from './SelectEmptyState';
import styles from './style';

class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      isAdding: false,
      filter: '',
    };
  }

  openModal = () => {
    this.setState({
      isModalOpen: true,
      filter: '',
    });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  setFilter = filter => {
    this.setState({ filter });
  };

  addOption = () => {
    this.setState({ isAdding: true });
  };

  onAddDone = (item) => {
    this.setState({ isAdding: false });
    if (item) {
      this.props.onSelectedItemChange(item);
      setTimeout(() => {
        this.closeModal();
      }, 1000);
    }
  };

  keyExtractor = item => String(item[this.props.uniqueKey]);

  renderSelectedItem = item => {
    return <Text style={styles.selected}>{item[this.props.displayKey]}</Text>;
  };

  renderPlaceholder = () => {
    return <Text style={styles.placeholder}>{this.props.placeholder}</Text>;
  };

  renderSectionHeader = ({ section: { title } }) =>
    title ? (
      <Separator style={baseStyles.separator} bordered>
        <Text>{title.toUpperCase()}</Text>
      </Separator>
    ) : null;

  renderItem = ({ item }) => {
    const { onSelectedItemChange, selectedItem, uniqueKey, renderItem, displayKey } = this.props;
    return (
      <ListItem
        style={[baseStyles.listItem, baseStyles.unbordered]}
        onPress={() => {
          onSelectedItemChange(item);
          this.closeModal();
        }}
      >
        {renderItem ? renderItem(item) : <Text style={baseStyles.listItemText}>{item[displayKey]}</Text>}
        {selectedItem && selectedItem[uniqueKey] === item[uniqueKey] ? (
          <Icon
            style={[baseStyles.listItemIcon, baseStyles.marginLeft, baseStyles.doubleMarginRight]}
            type="FontAwesome"
            name="check"
          />
        ) : null}
      </ListItem>
    );
  };

  render() {
    const {
      style,
      renderSelectedItem,
      selectedItem,
      items,
      disabled,
      modalHeader,
      filterable,
      displayKey,
      noMatchesCta,
      addOptionComponent,
      filterPlaceholder,
      isSectioned,
      renderSectionHeader,
      emptyListTitle,
      emptyListMessage,
    } = this.props;
    const { isModalOpen, filter, isAdding } = this.state;
    const renderSelected = renderSelectedItem || this.renderSelectedItem;

    const filtered = allItems => {
      if (filter) {
        return filterItems(filter, allItems, displayKey);
      }
      return allItems;
    };

    const emptyStateProps = {
      filterable,
      filter,
      noMatchesCta,
      addOption: addOptionComponent ? this.addOption : undefined,
      emptyListTitle,
      emptyListMessage,
    };

    const ListComponent = isSectioned ? SectionList : FlatList;
    const listProps = {
      keyboardShouldPersistTaps: 'always',
      extraData: selectedItem,
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
      <TouchableOpacity disabled={disabled} onPress={this.openModal} style={[styles.wrapper, style]}>
        <View style={styles.selectedWrapper}>
          {selectedItem ? renderSelected(selectedItem) : this.renderPlaceholder()}
        </View>
        <Icon type="FontAwesome" name="caret-down" style={styles.icon} />
        <Modal animationType="slide" visible={isModalOpen} onRequestClose={this.closeModal}>
          {isAdding ? (
            React.cloneElement(addOptionComponent, { onDone: this.onAddDone })
          ) : (
            <Container>
              <View style={[baseStyles.manualHeader, styles.header]}>
                <Left style={baseStyles.headerLeft} />
                <Body style={baseStyles.headerBody}>
                  <Title>{modalHeader}</Title>
                </Body>
                <Right style={baseStyles.headerRight}>
                  {!filterable && addOptionComponent ? (
                    <Button transparent onPress={this.addOption}>
                      <Icon style={styles.headerIcon} type="FontAwesome" name="plus" />
                    </Button>
                  ) : null}
                </Right>
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
          )}
        </Modal>
      </TouchableOpacity>
    );
  }
}

Select.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  uniqueKey: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  displayKey: PropTypes.string,
  modalHeader: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedItem: PropTypes.shape(),
  onSelectedItemChange: PropTypes.func.isRequired,
  renderSelectedItem: PropTypes.func,
  renderItem: PropTypes.func,
  filterable: PropTypes.bool,
  noMatchesCta: PropTypes.string,
  filterPlaceholder: PropTypes.string,
  isSectioned: PropTypes.bool,
  renderSectionHeader: PropTypes.func,
  emptyListTitle: PropTypes.string,
  emptyListMessage: PropTypes.string,
  addOptionComponent: PropTypes.node,
};

Select.defaultProps = {
  style: undefined,
  selectedItem: undefined,
  placeholder: Copy.defaultSelectPlaceholder,
  uniqueKey: 'id',
  displayKey: 'name',
  disabled: false,
  renderItem: undefined,
  renderSelectedItem: undefined,
  filterable: false,
  noMatchesCta: Copy.add,
  filterPlaceholder: Copy.defaultSearchPlaceholder,
  isSectioned: false,
  renderSectionHeader: undefined,
  emptyListTitle: Copy.nonIdealState.defaultEmptySelect.title,
  emptyListMessage: Copy.nonIdealState.defaultEmptySelect.message,
  addOptionComponent: undefined,
};

export default Select;
