import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Image } from 'react-native';
import { Container, Header, Title, Content, Left, Body, Right, Button } from 'native-base';
import BackButton from 'src/components/common/BackButton';
import TeamsStore from 'src/store/TeamsStore';
import TeamActivitiesStore from 'src/store/TeamActivitiesStore';
import { NavigationPropTypes } from 'src/util/PropTypes';
import styles from './style';

@inject('teams', 'teamActivities')
@observer
class AddPhotoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  uploadPhoto = () => {};

  render() {
    const { navigation } = this.props;
    const image = navigation.state.params.image;
    return (
      <Container>
        <Header>
          <Left>
            <BackButton />
          </Left>
          <Body>
            <Title>Add Photo</Title>
          </Body>
          <Right>
            <Button text="Save" transparent onPress={this.uploadPhoto} />
          </Right>
        </Header>
        <Content>
          <Image source={{ uri: image.uri }} style={styles.image} />
        </Content>
      </Container>
    );
  }
}

AddPhotoScreen.propTypes = {
  navigation: NavigationPropTypes.isRequired,
};

AddPhotoScreen.defaultProps = {};

AddPhotoScreen.wrappedComponent.propTypes = {
  teamActivities: PropTypes.instanceOf(TeamActivitiesStore).isRequired,
  teams: PropTypes.instanceOf(TeamsStore).isRequired,
};

export default AddPhotoScreen;
