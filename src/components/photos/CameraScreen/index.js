import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, CameraRoll, View } from 'react-native';
import { Container, Left, Body, Icon, Right } from 'native-base';
import { RNCamera } from 'react-native-camera';
import { inject, observer } from 'mobx-react';
import BackButton from 'src/components/common/BackButton';
import PermissionsStore, { Permission } from 'src/store/PermissionsStore';
import { NavigationPropTypes } from 'src/util/PropTypes';
import styles from './style';

const PHOTO_OPTIONS = {
  quality: 0.5,
  base64: true,
};

@inject('permissions')
@observer
class CameraScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const hasPermission = await this.props.permissions.requestPermission(Permission.WriteToExternalStorage, {
      title: 'Permission to save photos',
      message: 'Adroit needs access to your external storage so you can save photos to your camera roll',
    });
    console.log('has WriteToExternalStorage permission', hasPermission);
  }

  takePicture = async () => {
    console.log('Taking picture', this.camera);
    if (this.camera) {
      const data = await this.camera.takePictureAsync(PHOTO_OPTIONS);

      if (this.props.permissions.canWriteToExternalStorage) {
        const uri = await CameraRoll.saveToCameraRoll(data.uri, 'photo');
        console.log(uri);
      }
      this.props.navigation.navigate('AddPhoto', { image: data });
    }
  };

  render() {
    const { navigation, permissions } = this.props;
    return (
      <Container>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          permissionDialogTitle="Permission to use camera"
          permissionDialogMessage="We need your permission to use your camera phone"
        />
        <View style={styles.overlay}>
          <View style={[styles.overlayItem, styles.header]}>
            <Left>
              <BackButton light />
            </Left>
          </View>
          <View style={[styles.overlayItem, styles.footer]}>
            <Left />
            <Body>
              <TouchableOpacity onPress={this.takePicture}>
                <Icon type="FontAwesome" name="circle-thin" style={styles.captureIcon} />
              </TouchableOpacity>
            </Body>
            <Right />
          </View>
        </View>
      </Container>
    );
  }
}

CameraScreen.propTypes = {
  navigation: NavigationPropTypes.isRequired,
};

CameraScreen.wrappedComponent.propTypes = {
  permissions: PropTypes.instanceOf(PermissionsStore).isRequired,
};

CameraScreen.defaultProps = {};

export default CameraScreen;
