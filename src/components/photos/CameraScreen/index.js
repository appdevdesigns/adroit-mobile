import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, CameraRoll, View, Image, SafeAreaView } from 'react-native';
import { Container, Icon } from 'native-base';
import ImageResizer from 'react-native-image-resizer';
import { RNCamera } from 'react-native-camera';
import { inject, observer } from 'mobx-react';
import Copy from 'src/assets/Copy';
import baseStyles from 'src/assets/style';
import { GridSize } from 'src/assets/theme';
import BackButton from 'src/components/common/BackButton';
import AdroitScreen from 'src/components/common/AdroitScreen';
import AppScreen from 'src/components/app/AppScreen';
import PermissionsStore, { Permission } from 'src/store/PermissionsStore';
import DraftActivityImageStore from 'src/store/DraftActivityImageStore';
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

@inject('permissions', 'deviceInfo', 'draft')
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
              this.props.draft.initNewDraft(resized);
              this.props.navigation.navigate(AppScreen.AddPhoto);
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

    const isPortrait = orientation !== 'LANDSCAPE';

    const overlayStyle = isPortrait
      ? {
          flexDirection: 'column',
        }
      : {
          flexDirection: 'row',
        };

    const overlayItemStyle = isPortrait
      ? {
          flexDirection: 'row',
        }
      : {
          flexDirection: 'column-reverse',
        };

    const headerStyle = isPortrait
      ? {
          paddingLeft: 10,
          paddingRight: 10,
        }
      : {
          paddingBottom: 10,
          paddingTop: 10,
        };

    const footerStyle = isPortrait
      ? {
          paddingBottom: GridSize * 2,
          paddingRight: 0,
        }
      : {
          paddingBottom: 0,
          paddingRight: GridSize * 2,
        };

    return (
      <AdroitScreen orientation={null}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
          <Container>
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
              <View style={[styles.overlayItem, overlayItemStyle, headerStyle]}>
                <View style={[baseStyles.headerLeft, overlayItemStyle]}>
                  <BackButton light />
                </View>
                <View style={baseStyles.headerBody}>
                  <TouchableOpacity onPress={this.toggleCameraType}>
                    <Image source={imgFlipCamera} style={[styles.toolbarImage, styles.typeImage]} />
                  </TouchableOpacity>
                </View>
                <View style={[baseStyles.headerRight, overlayItemStyle]}>
                  <TouchableOpacity onPress={this.cycleFlashMode}>
                    <Image
                      source={flashModes[flashModeIndex].source}
                      style={[styles.toolbarImage, styles.flashImage]}
                    />
                  </TouchableOpacity>
                </View>
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
        </SafeAreaView>
      </AdroitScreen>
    );
  }
}

CameraScreen.propTypes = {
  navigation: NavigationPropTypes.isRequired,
};

CameraScreen.wrappedComponent.propTypes = {
  permissions: PropTypes.instanceOf(PermissionsStore).isRequired,
  deviceInfo: PropTypes.instanceOf(DeviceInfoStore).isRequired,
  draft: PropTypes.instanceOf(DraftActivityImageStore).isRequired,
};

export default CameraScreen;
