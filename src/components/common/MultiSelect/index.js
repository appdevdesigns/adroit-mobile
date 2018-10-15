import React from 'react';
import PropTypes from 'prop-types';
import reject from 'lodash-es/reject';
import { View, Modal, FlatList, TouchableOpacity } from 'react-native';
import { Button, Icon, Text, ListItem, Left, Body, Right } from 'native-base';
import styles from './style';

class MultiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  shouldComponentUpdate() {
    return true;
  }

  openModal = () => {
    this.setState({ modalVisible: true });
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  removeItem = item => {
    console.log('Removing item', item);
    const { uniqueKey } = this.props;
    this.props.onSelectedItemsChange(reject(this.props.selectedItems, i => item[uniqueKey] === i[uniqueKey]));
  };

  addItem = item => {
    console.log('Adding item', item);
    this.props.onSelectedItemsChange(this.props.selectedItems.concat([item]));
  };

  toggleItem = item => {
    if (this.props.selectedItems.includes(item)) {
      this.removeItem(item);
    } else {
      this.addItem(item);
    }
  };

  keyExtractor = item => String(item[this.props.uniqueKey]);

  renderItem = ({ item }) => {
    const { displayKey, uniqueKey } = this.props;
    const itemIcon = this.props.selectedItems.includes(item) ? 'check-square' : 'square-o';
    return (
      <ListItem
        key={item[uniqueKey]}
        onPress={() => {
          console.log('Pressed item', item);
          this.toggleItem(item);
        }}
      >
        <Icon type="FontAwesome" name={itemIcon} />
        <Text style={styles.listItemText}>{item[displayKey]}</Text>
      </ListItem>
    );
  };

  render() {
    const { modalVisible } = this.state;
    const { placeholder, items, selectedItems, modalHeader, displayKey, uniqueKey } = this.props;
    return (
      <View style={styles.wrapper}>
        <View style={styles.items}>
          {!selectedItems.length ? (
            <TouchableOpacity onPress={this.openModal}>
              <Text style={styles.placeholder}>{placeholder}</Text>
            </TouchableOpacity>
          ) : null}
          {selectedItems.map(item => (
            <Button
              bordered
              small
              dark
              style={styles.itemTag}
              iconRight
              key={item[uniqueKey]}
              onPress={() => {
                this.removeItem(item);
              }}
            >
              <Text style={styles.itemTagText}>{item[displayKey]}</Text>
              <Icon style={styles.itemTagIcon} type="FontAwesome" name="times" />
            </Button>
          ))}
        </View>
        <Button style={styles.button} transparent onPress={this.openModal}>
          <Icon style={styles.buttonIcon} type="FontAwesome" name="caret-down" />
        </Button>
        <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={this.closeModal}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Left />
              <Body>
                <Text style={styles.modalHeaderTitle}>{modalHeader}</Text>
              </Body>
              <Right>
                <Button style={styles.modalCloseButton} transparent dark onPress={this.closeModal}>
                  <Icon style={styles.modalCloseButtonIcon} type="FontAwesome" name="check" />
                </Button>
              </Right>
            </View>
            <FlatList
              style={styles.list}
              extraData={selectedItems}
              data={items}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

const ItemPropTypes = PropTypes.shape();

MultiSelect.propTypes = {
  uniqueKey: PropTypes.string,
  placeholder: PropTypes.string,
  displayKey: PropTypes.string,
  modalHeader: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(ItemPropTypes).isRequired,
  selectedItems: PropTypes.arrayOf(ItemPropTypes).isRequired,
  onSelectedItemsChange: PropTypes.func.isRequired,
};

MultiSelect.defaultProps = {
  placeholder: 'Select...',
  uniqueKey: 'id',
  displayKey: 'name',
};

export default MultiSelect;
