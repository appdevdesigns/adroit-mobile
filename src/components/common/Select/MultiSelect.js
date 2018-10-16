import React from 'react';
import PropTypes from 'prop-types';
import reject from 'lodash-es/reject';
import { View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Button, Icon, Text, ListItem, Container, Header, Title, Content, Left, Right, Body } from 'native-base';
import styles from './style';

class MultiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
  }

  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  removeItem = item => {
    const { uniqueKey, onSelectedItemsChange } = this.props;
    onSelectedItemsChange(reject(this.props.selectedItems, i => item[uniqueKey] === i[uniqueKey]));
  };

  addItem = item => {
    const { onSelectedItemsChange } = this.props;
    onSelectedItemsChange(this.props.selectedItems.concat([item]));
  };

  toggleItem = item => {
    if (this.props.selectedItems.includes(item)) {
      this.removeItem(item);
    } else {
      this.addItem(item);
    }
  };

  keyExtractor = item => String(item[this.props.uniqueKey]);

  renderSelectedItems = items => (
    <Text style={styles.selected}>{items.map(item => item[this.props.displayKey]).join(', ')}</Text>
  );

  renderPlaceholder = () => (
    <Text ellipsizeMode="tail" style={styles.placeholder}>
      {this.props.placeholder}
    </Text>
  );

  renderItem = ({ item }) => {
    const { selectedItems, uniqueKey, renderItem, displayKey } = this.props;
    const itemIcon = selectedItems.includes(item) ? 'check-square' : 'square-o';
    return (
      <ListItem
        key={item[uniqueKey]}
        onPress={() => {
          this.toggleItem(item);
        }}
      >
        <Body>
          {renderItem ? (
            renderItem(item)
          ) : (
            <Text ellipsizeMode="tail" style={styles.item}>
              {item[displayKey]}
            </Text>
          )}
        </Body>
        <Right>
          <Icon style={styles.itemIcon} type="FontAwesome" name={itemIcon} />
        </Right>
      </ListItem>
    );
  };

  render() {
    const { style, renderSelectedItems, selectedItems, items, modalHeader } = this.props;
    const { isModalOpen } = this.state;
    const renderSelected = renderSelectedItems || this.renderSelectedItems;
    return (
      <TouchableOpacity onPress={this.openModal} style={[styles.wrapper, style]}>
        <View style={styles.selectedWrapper}>
          {selectedItems.length ? renderSelected(selectedItems) : this.renderPlaceholder()}
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
              <FlatList
                extraData={selectedItems}
                data={items}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
              />
            </Content>
          </Container>
        </Modal>
      </TouchableOpacity>
    );
  }
}

MultiSelect.propTypes = {
  style: PropTypes.shape(),
  uniqueKey: PropTypes.string,
  placeholder: PropTypes.string,
  displayKey: PropTypes.string,
  modalHeader: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedItems: PropTypes.arrayOf(PropTypes.shape()),
  onSelectedItemsChange: PropTypes.func.isRequired,
  renderSelectedItems: PropTypes.func,
  renderItem: PropTypes.func,
};

MultiSelect.defaultProps = {
  style: undefined,
  selectedItems: [],
  placeholder: 'Select...',
  uniqueKey: 'id',
  displayKey: 'name',
  renderItem: undefined,
  renderSelectedItems: undefined,
};

export default MultiSelect;
