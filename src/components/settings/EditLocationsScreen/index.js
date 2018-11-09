import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { FlatList, View } from 'react-native';
import { Container, Button, Icon, Header, Title, Content, Left, Body, Right, ListItem, Text } from 'native-base';
import BackButton from 'src/components/common/BackButton';
import LocationsStore from 'src/store/LocationsStore';
import Modal from 'src/components/common/Modal';
import baseStyles from 'src/assets/style';
import styles from './style';

@inject('locations')
@observer
class EditLocationsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHelpVisible: false,
    };
  }

  keyExtractor = item => item.location;

  remove = item => {
    this.props.locations.removeUserLocation(item);
  };

  showHelp = () => {
    this.setState({ isHelpVisible: true });
  };

  hideHelp = () => {
    this.setState({ isHelpVisible: false });
  };

  renderItem = ({ item }) => (
    <ListItem style={[baseStyles.listItem, styles.listItem]}>
      <Text style={baseStyles.listItemText}>{item.location}</Text>
      <Button small danger transparent onPress={() => this.remove(item)}>
        <Icon active type="FontAwesome" name="trash" />
      </Button>
    </ListItem>
  );

  render() {
    const { locations } = this.props;
    const { isHelpVisible } = this.state;
    const textStyle = [baseStyles.paragraph, styles.modalText];
    return (
      <Container>
        <Header>
          <Left>
            <BackButton />
          </Left>
          <Body>
            <Title>Edit Locations</Title>
          </Body>
          <Right>
            <Button transparent onPress={this.showHelp}>
              <Icon type="FontAwesome" name="question-circle-o" />
            </Button>
          </Right>
        </Header>
        <Content>
          <FlatList data={locations.userLocations} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />
          <Modal
            visible={isHelpVisible}
            animationType="fade"
            transparent
            onRequestClose={this.hideHelp}
            header="Your saved locations"
          >
            <View>
              <Text style={textStyle}>
                As an alternative to selecting one of the default FCF locations, you can add a new location when
                uploading an activity photo.
              </Text>
              <Text style={textStyle}>
                Any &apos;custom&apos; locations you add are stored on your device and available to select again.
              </Text>
              <Text style={textStyle}>
                You can remove any of these &apos;custom&apos; locations on this page. (This will not affect any
                previously uploaded photos tagged with that location).
              </Text>
            </View>
          </Modal>
        </Content>
      </Container>
    );
  }
}

EditLocationsScreen.propTypes = {};

EditLocationsScreen.defaultProps = {};

EditLocationsScreen.wrappedComponent.propTypes = {
  locations: PropTypes.instanceOf(LocationsStore).isRequired,
};

export default EditLocationsScreen;
