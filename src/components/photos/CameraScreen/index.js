import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, CameraRoll, View, Image } from 'react-native';
import { Container, Left, Body, Icon, Right } from 'native-base';
import { RNCamera } from 'react-native-camera';
import { inject, observer } from 'mobx-react';
import Copy from 'src/assets/Copy';
import BackButton from 'src/components/common/BackButton';
import AppScreen from 'src/components/app/AppScreen';
import PermissionsStore, { Permission } from 'src/store/PermissionsStore';
import { NavigationPropTypes } from 'src/util/PropTypes';
import styles from './style';

const imgFlashOn = require('src/assets/img/flashOn.png');
const imgFlashOff = require('src/assets/img/flashOff.png');
const imgFlashAuto = require('src/assets/img/flashAuto.png');

const imgFlipCamera = require('src/assets/img/cameraFlipIcon.png');

const flashModes = [
  { mode: RNCamera.Constants.FlashMode.auto, source: imgFlashAuto },
  { mode: RNCamera.Constants.FlashMode.off, source: imgFlashOff },
  { mode: RNCamera.Constants.FlashMode.on, source: imgFlashOn },
];

const PHOTO_OPTIONS = {
  quality: 0.5,
  base64: true,
};

@inject('permissions')
@observer
class CameraScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flashModeIndex: 0,
      type: RNCamera.Constants.Type.back,
    };
  }

  async componentDidMount() {
    const hasPermission = await this.props.permissions.requestPermission(Permission.WriteToExternalStorage, {
      title: Copy.perms.cameraRollWrite.title,
      message: Copy.perms.cameraRollWrite.message,
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
      this.props.navigation.navigate(AppScreen.AddPhoto, { image: data });
    }
  };

  toggleCameraType = () => {
    this.setState(prevState => ({
      type:
        prevState.type === RNCamera.Constants.Type.back ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back,
    }));
  };

  cycleFlashMode = () => {
    this.setState(prevState => ({ flashModeIndex: (prevState.flashModeIndex + 1) % flashModes.length }));
  };

  render() {
    const { flashModeIndex, type } = this.state;
    return (
      <Container>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={type}
          flashMode={flashModes[flashModeIndex].mode}
          permissionDialogTitle={Copy.perms.camera.title}
          permissionDialogMessage={Copy.perms.camera.message}
        />
        <View style={styles.overlay}>
          <View style={[styles.overlayItem, styles.header]}>
            <Left>
              <BackButton light />
            </Left>
            <Body>
              <TouchableOpacity onPress={this.toggleCameraType}>
                <Image source={imgFlipCamera} style={[styles.toolbarImage, styles.typeImage]} />
              </TouchableOpacity>
            </Body>
            <Right>
              <TouchableOpacity onPress={this.cycleFlashMode}>
                <Image source={flashModes[flashModeIndex].source} style={[styles.toolbarImage, styles.flashImage]} />
              </TouchableOpacity>
            </Right>
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

export default CameraScreen;
