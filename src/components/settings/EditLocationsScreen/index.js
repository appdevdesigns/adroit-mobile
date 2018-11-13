import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { FlatList, View } from 'react-native';
import { Container, Button, Icon, Header, Title, Content, Left, Body, Right, ListItem, Text } from 'native-base';
import Copy from 'src/assets/Copy';
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
            <Title>{Copy.editLocationsTitle}</Title>
          </Body>
          <Right>
            <Button transparent onPress={this.showHelp}>
              <Icon type="FontAwesome" name="question-circle-o" />
            </Button>
          </Right>
        </Header>
        <Content>
          {locations.authenticatedUsersLocations.length ? (
            <FlatList
              data={locations.authenticatedUsersLocations}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
            />
          ) : (
            <View style={baseStyles.emptyContainer}>
              <Text style={baseStyles.emptyText}>{Copy.editLocationsEmpty}</Text>
            </View>
          )}

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
