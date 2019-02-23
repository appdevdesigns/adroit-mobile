import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Image, TouchableOpacity } from 'react-native';
import { Container, Content } from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import UsersStore from 'src/store/UsersStore';
import AdroitScreen from 'src/components/common/AdroitScreen';
import AdroitHeader from 'src/components/common/AdroitHeader';
import Copy from 'src/assets/Copy';
import styles from './style';

const placeholderImage = require('src/assets/img/avatar-placeholder.jpg');

@inject('users')
@observer
class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePic: props.users.me.avatar ? { uri: users.me.avatar } : placeholderImage,
    };
  }

  pickProfilePic = () => {
    try {
      ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
      }).then(image => {
        console.log(image);
        this.setState({ profilePic: { uri: image.path } });
      });
    } catch (error) {
      console.log('Error', error);
    }
  };

  cropProfilePic = () => {
    const { profilePic } = this.state;
    try {
      ImagePicker.openCropper({
        path: 'https://dummyimage.com/600',
        width: 400,
        height: 400,
      })
        .then(image => {
          console.log(image);
          this.setState({ profilePic: { uri: image.path } });
        })
        .catch(() => {
          console.log('User cancelled');
        });
    } catch (error) {
      console.log('Error', error);
    }
  };

  render() {
    const { users } = this.props;
    const { profilePic } = this.state;
    return (
      <AdroitScreen>
        <Container>
          <AdroitHeader title={users.me.displayName} />
          <Content padder>
            <TouchableOpacity onPress={this.pickProfilePic}>
              <Image style={styles.profilePic} source={profilePic} />
            </TouchableOpacity>
          </Content>
        </Container>
      </AdroitScreen>
    );
  }
}

ProfileScreen.propTypes = {};

ProfileScreen.wrappedComponent.propTypes = {
  users: PropTypes.instanceOf(UsersStore).isRequired,
};

export default ProfileScreen;
