import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Modal, FlatList } from 'react-native';
import {
  Button,
  Item,
  Icon,
  Text,
  ListItem,
  Container,
  Header,
  Title,
  Content,
  Left,
  Right,
  Body,
  Form,
  Input,
} from 'native-base';
import baseStyles from 'src/assets/style';
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

  renderSelectedItem = item => <Text style={styles.selected}>{item[this.props.displayKey]}</Text>;

  renderPlaceholder = () => <Text style={styles.placeholder}>{this.props.placeholder}</Text>;

  renderItem = ({ item }) => {
    const { onSelectedItemChange, selectedItem, uniqueKey, renderItem, displayKey } = this.props;
    return (
      <ListItem
        style={baseStyles.listItem}
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
    } = this.props;
    const { isModalOpen, filter } = this.state;
    const renderSelected = renderSelectedItem || this.renderSelectedItem;
    let filteredItems = items;
    if (filter) {
      const filterRegExp = RegExp(filter, 'i');
      filteredItems = items.filter(item => filterRegExp.test(item[displayKey]));
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
              <Left style={styles.headerSide} />
              <Body style={styles.headerBody}>
                <Title>{modalHeader}</Title>
              </Body>
              <Right style={styles.headerSide}>
                <Button transparent onPress={this.closeModal}>
                  <Icon type="FontAwesome" name="times" />
                </Button>
              </Right>
            </Header>
            <Content>
              {filterable ? (
                <View style={baseStyles.listItem}>
                  <Input
                    style={styles.filterInput}
                    placeholder="Search..."
                    onChangeText={this.setFilter}
                    value={filter}
                  />
                  <Icon
                    style={[baseStyles.listItemIcon, baseStyles.marginLeft, baseStyles.doubleMarginRight]}
                    type="FontAwesome"
                    name="search"
                  />
                </View>
              ) : null}
              {filterable && !filteredItems.length ? (
                <View style={styles.noMatches}>
                  <Text>Could not find:</Text>
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
                <FlatList
                  extraData={selectedItem}
                  data={filteredItems}
                  keyExtractor={this.keyExtractor}
                  renderItem={this.renderItem}
                />
              )}
            </Content>
          </Container>
        </Modal>
      </TouchableOpacity>
    );
  }
}

Select.propTypes = {
  style: PropTypes.shape(),
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
  onAddOption: PropTypes.func,
};

Select.defaultProps = {
  style: undefined,
  selectedItem: undefined,
  placeholder: 'Select...',
  uniqueKey: 'id',
  displayKey: 'name',
  renderItem: undefined,
  renderSelectedItem: undefined,
  filterable: false,
  noMatchesCta: 'Add',
  onAddOption: undefined,
};

export default Select;
