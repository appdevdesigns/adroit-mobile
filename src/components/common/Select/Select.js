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
  Header,
  Title,
  Content,
  Body,
  Separator,
  Footer,
  FooterTab,
  Input,
} from 'native-base';
import baseStyles from 'src/assets/style';
import Copy from 'src/assets/Copy';
import NonIdealState from 'src/components/common/NonIdealState';
import styles from './style';

class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
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
    this.props.onAddOption(this.state.filter);
    this.closeModal();
  };

  keyExtractor = item => String(item[this.props.uniqueKey]);

  renderSelectedItem = item => {
    console.log('Rendering selected item', item[this.props.displayKey]);
    return <Text style={styles.selected}>{item[this.props.displayKey]}</Text>;
  };

  renderPlaceholder = () => {
    console.log('Rendering placeholder', this.props.placeholder);
    return <Text style={styles.placeholder}>{this.props.placeholder}</Text>;
  };

  renderSectionHeader = ({ section: { title } }) =>
    title ? (
      <Separator bordered>
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
        {renderItem ? (
          renderItem(item)
        ) : (
          <Text ellipsizeMode="tail" style={baseStyles.listItemText}>
            {item[displayKey]}
          </Text>
        )}
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
      modalHeader,
      filterable,
      displayKey,
      noMatchesCta,
      filterPlaceholder,
      isSectioned,
      renderSectionHeader,
      emptyListTitle,
      emptyListMessage,
    } = this.props;
    const { isModalOpen, filter } = this.state;
    const renderSelected = renderSelectedItem || this.renderSelectedItem;

    const filterItems = allItems => {
      if (filter) {
        const filterRegExp = RegExp(filter, 'i');
        return allItems.filter(item => filterRegExp.test(item[displayKey]));
      }
      return allItems;
    };

    const ListComponent = isSectioned ? SectionList : FlatList;
    const listProps = {
      extraData: selectedItem,
      keyExtractor: this.keyExtractor,
      renderItem: this.renderItem,
      ItemSeparatorComponent: () => <View style={styles.separator} />,
      ListEmptyComponent: filterable ? (
        <View style={styles.noMatches}>
          <Text>{Copy.couldNotFind}</Text>
          <Text style={styles.filterCopy}>
            &quot;
            {filter}
            &quot;
          </Text>
          <Button iconLeft style={styles.noMatchesButton} primary onPress={this.addOption}>
            <Icon type="FontAwesome" name="plus" />
            <Text>{noMatchesCta}</Text>
          </Button>
        </View>
      ) : (
        <NonIdealState title={emptyListTitle} message={emptyListMessage} />
      ),
    };
    if (isSectioned) {
      listProps.sections = reduce(
        items,
        (acc, item) => {
          const filteredItems = filterItems(item.data);
          if (filteredItems.length) {
            acc.push({ ...item, data: filteredItems });
          }
          return acc;
        },
        []
      );
      listProps.renderSectionHeader = renderSectionHeader || this.renderSectionHeader;
    } else {
      listProps.data = filterItems(items);
    }

    return (
      <TouchableOpacity onPress={this.openModal} style={[styles.wrapper, style]}>
        <View style={styles.selectedWrapper}>
          {selectedItem ? renderSelected(selectedItem) : this.renderPlaceholder()}
        </View>
        <Icon type="FontAwesome" name="caret-down" style={styles.icon} />
        <Modal animationType="slide" visible={isModalOpen} onRequestClose={this.closeModal}>
          <Container>
            <Header>
              <Body style={styles.headerBody}>
                <Title>{modalHeader}</Title>
              </Body>
            </Header>
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
              <ListComponent {...listProps} />
            </Content>
            <Footer>
              <FooterTab>
                <Button active full dark onPress={this.closeModal}>
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

Select.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  uniqueKey: PropTypes.string,
  placeholder: PropTypes.string,
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
  onAddOption: PropTypes.func,
  isSectioned: PropTypes.bool,
  renderSectionHeader: PropTypes.func,
  emptyListTitle: PropTypes.string,
  emptyListMessage: PropTypes.string,
};

Select.defaultProps = {
  style: undefined,
  selectedItem: undefined,
  placeholder: Copy.defaultSelectPlaceholder,
  uniqueKey: 'id',
  displayKey: 'name',
  renderItem: undefined,
  renderSelectedItem: undefined,
  filterable: false,
  noMatchesCta: Copy.add,
  filterPlaceholder: Copy.defaultSearchPlaceholder,
  onAddOption: undefined,
  isSectioned: false,
  renderSectionHeader: undefined,
  emptyListTitle: Copy.nonIdealState.defaultEmptySelect.title,
  emptyListMessage: Copy.nonIdealState.defaultEmptySelect.message,
};

export default Select;
