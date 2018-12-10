import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { FlatList, View } from 'react-native';
import { Container, Button, Icon, Header, Title, Content, Left, Body, Right, ListItem, Text, Input } from 'native-base';
import Copy from 'src/assets/Copy';
import baseStyles from 'src/assets/style';
import BackButton from 'src/components/common/BackButton';
import LocationsStore from 'src/store/LocationsStore';
import Modal from 'src/components/common/Modal';
import Toast from 'src/util/Toast';
import styles from './style';
import NonIdealState from '../../common/NonIdealState';

@inject('locations')
@observer
class EditLocationsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHelpVisible: false,
      newLocation: '',
    };
  }

  keyExtractor = item => item.name;

  remove = item => {
    this.props.locations.removeUserLocation(item);
  };

  addLocation = () => {
    if (this.props.locations.authenticatedUsersLocations.find(l => l.name === this.state.newLocation)) {
      Toast.danger(Copy.toast.locationAlreadyExists);
      return;
    }
    this.props.locations.addUserLocation({ name: this.state.newLocation });
    this.setState({ newLocation: '' });
  };

  updateNewLocation = newLocation => this.setState({ newLocation });

  showHelp = () => {
    this.setState({ isHelpVisible: true });
  };

  hideHelp = () => {
    this.setState({ isHelpVisible: false });
  };

  renderItem = ({ item }) => (
    <ListItem style={[baseStyles.listItem, styles.listItem]}>
      <Text style={baseStyles.listItemText}>{item.name}</Text>
      <Button small danger transparent onPress={() => this.remove(item)}>
        <Icon active type="FontAwesome" name="trash" />
      </Button>
    </ListItem>
  );

  render() {
    const { locations } = this.props;
    const { isHelpVisible, newLocation } = this.state;
    const textStyle = [baseStyles.paragraph, styles.modalText];
    return (
      <Container>
        <Header>
          <Left style={baseStyles.headerLeft}>
            <BackButton />
          </Left>
          <Body style={baseStyles.headerBody}>
            <Title>{Copy.editLocationsTitle}</Title>
          </Body>
          <Right style={baseStyles.headerRight}>
            <Button transparent onPress={this.showHelp}>
              <Icon type="FontAwesome" name="question-circle-o" />
            </Button>
          </Right>
        </Header>
        <Content>
          <View style={[baseStyles.listItem]}>
            <Input
              style={styles.input}
              placeholder="Add a location..."
              placeholderTextColor="#999"
              onChangeText={this.updateNewLocation}
              value={newLocation}
            />
            <Button
              transparent
              disabled={!newLocation}
              style={[styles.addButton, baseStyles.marginLeft]}
              icon
              onPress={this.addLocation}
            >
              <Icon type="FontAwesome" name="plus" />
            </Button>
          </View>
          <FlatList
            ListEmptyComponent={
              <NonIdealState
                title={Copy.nonIdealState.noUserLocations.title}
                message={Copy.nonIdealState.noUserLocations.message}
              />
            }
            data={locations.authenticatedUsersLocations}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
          />
          <Modal
            visible={isHelpVisible}
            animationType="fade"
            transparent
            onRequestClose={this.hideHelp}
            header={Copy.editLocationsHelp.title}
          >
            <View>
              <Text style={textStyle}>{Copy.editLocationsHelp.p1}</Text>
              <Text style={textStyle}>{Copy.editLocationsHelp.p2}</Text>
              <Text style={textStyle}>{Copy.editLocationsHelp.p3}</Text>
            </View>
          </Modal>
        </Content>
      </Container>
    );
  }
}

EditLocationsScreen.wrappedComponent.propTypes = {
  locations: PropTypes.instanceOf(LocationsStore).isRequired,
};

export default EditLocationsScreen;
