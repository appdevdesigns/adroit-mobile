import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Button, Icon, Text, ListItem, Container, Header, Title, Content, Left, Right, Body } from 'native-base';
import styles from './style';

class Select extends React.Component {
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

  keyExtractor = item => String(item[this.props.uniqueKey]);

  renderSelectedItem = item => <Text style={styles.selected}>{item[this.props.displayKey]}</Text>;

  renderPlaceholder = () => <Text style={styles.placeholder}>{this.props.placeholder}</Text>;

  renderItem = ({ item }) => {
    const { onSelectedItemChange, selectedItem, uniqueKey, renderItem, displayKey } = this.props;
    return (
      <ListItem
        onPress={() => {
          onSelectedItemChange(item);
          this.closeModal();
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
          {selectedItem && selectedItem[uniqueKey] === item[uniqueKey] ? (
            <Icon style={styles.itemIcon} type="FontAwesome" name="check" />
          ) : null}
        </Right>
      </ListItem>
    );
  };

  render() {
    const { style, renderSelectedItem, selectedItem, items, modalHeader } = this.props;
    const { isModalOpen } = this.state;
    const renderSelected = renderSelectedItem || this.renderSelectedItem;
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
              <FlatList
                extraData={selectedItem}
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
};

Select.defaultProps = {
  style: undefined,
  selectedItem: undefined,
  placeholder: 'Select...',
  uniqueKey: 'id',
  displayKey: 'name',
  renderItem: undefined,
  renderSelectedItem: undefined,
};

export default Select;
