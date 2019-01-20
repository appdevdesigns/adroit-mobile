import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, CameraRoll, View, Image, StatusBar } from 'react-native';
import { Container, Icon } from 'native-base';
import ImageResizer from 'react-native-image-resizer';
import { RNCamera } from 'react-native-camera';
import { inject, observer } from 'mobx-react';
import Copy from 'src/assets/Copy';
import { GridSize } from 'src/assets/theme';
import BackButton from 'src/components/common/BackButton';
import AdroitScreen from 'src/components/common/AdroitScreen';
import AppScreen from 'src/components/app/AppScreen';
import PermissionsStore, { Permission } from 'src/store/PermissionsStore';
import DeviceInfoStore from 'src/store/DeviceInfoStore';
import { NavigationPropTypes } from 'src/util/PropTypes';
import Monitoring, { Event } from 'src/util/Monitoring';
import Constants from 'src/util/Constants';
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

@inject('permissions', 'deviceInfo')
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
    await this.props.permissions.requestPermission(Permission.WriteToExternalStorage, {
      title: Copy.perms.cameraRollWrite.title,
      message: Copy.perms.cameraRollWrite.message,
    });
  }

  takePicture = () => {
    if (this.camera) {
      this.camera
        .takePictureAsync(PHOTO_OPTIONS)
        .then(data => {
          if (this.props.permissions.canWriteToExternalStorage) {
            CameraRoll.saveToCameraRoll(data.uri, 'photo').then(uri => {
              Monitoring.debug('Saved photo to camera roll', uri);
            });
          }
          Monitoring.event(Event.PhotoTaken);
          ImageResizer.createResizedImage(
            data.uri,
            Constants.imageUploadMaxWidth,
            Constants.imageUploadMaxHeight,
            'JPEG',
            100,
            0
          )
            .then(resized => {
              this.props.navigation.navigate(AppScreen.AddPhoto, { image: resized });
            })
            .catch(err => {
              Monitoring.exception(err, { problem: 'Could not resize photo' });
            });
        })
        .catch(err => {
          Monitoring.exception(err, { problem: 'Failed to take photo' });
        });
    } else {
      Monitoring.error('No camera reference');
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
    const {
      deviceInfo: { orientation },
    } = this.props;
    const overlayStyle = {
      flexDirection: orientation === 'PORTRAIT' ? 'column' : 'row',
    };
    const overlayItemStyle = {
      flexDirection: orientation === 'PORTRAIT' ? 'row' : 'column-reverse',
    };
    const footerStyle = {
      paddingBottom: orientation === 'PORTRAIT' ? GridSize * 2 : 0,
      paddingRight: orientation === 'PORTRAIT' ? 0 : GridSize * 2,
    };
    return (
      <AdroitScreen orientation={null}>
        <Container>
          <StatusBar hidden />
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.preview}
            type={type}
            captureAudio={false}
            flashMode={flashModes[flashModeIndex].mode}
            permissionDialogTitle={Copy.perms.camera.title}
            permissionDialogMessage={Copy.perms.camera.message}
          />
          <View style={[styles.overlay, overlayStyle]}>
            <View style={[styles.overlayItem, styles.header, overlayItemStyle]}>
              <BackButton light />
              <TouchableOpacity onPress={this.toggleCameraType}>
                <Image source={imgFlipCamera} style={[styles.toolbarImage, styles.typeImage]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.cycleFlashMode}>
                <Image source={flashModes[flashModeIndex].source} style={[styles.toolbarImage, styles.flashImage]} />
              </TouchableOpacity>
            </View>
            <View style={[styles.overlayItem, styles.footer, overlayItemStyle, footerStyle]}>
              <TouchableOpacity onPress={this.takePicture}>
                <View style={styles.captureIconWrapper}>
                  <Icon type="FontAwesome" name="circle-thin" style={styles.captureIcon} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Container>
      </AdroitScreen>
    );
  }
}

CameraScreen.propTypes = {
  navigation: NavigationPropTypes.isRequired,
  currentOrientation: PropTypes.string,
};

CameraScreen.defaultProps = {
  currentOrientation: null,
};

CameraScreen.wrappedComponent.propTypes = {
  permissions: PropTypes.instanceOf(PermissionsStore).isRequired,
  deviceInfo: PropTypes.instanceOf(DeviceInfoStore).isRequired,
};

export default CameraScreen;
