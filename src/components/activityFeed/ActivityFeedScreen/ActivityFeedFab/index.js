import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Platform, CameraRoll } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { withNavigation, withNavigationFocus } from 'react-navigation';
import { Icon, Fab, Button } from 'native-base';
import Copy from 'src/assets/Copy';
import AppScreen from 'src/components/app/AppScreen';
import DraftActivityImageStore from 'src/store/DraftActivityImageStore';
import { CopilotView, CopilotStepAddPhoto } from 'src/util/copilot';
import { NavigationPropTypes } from 'src/util/PropTypes';
import Monitoring, { Event } from 'src/util/Monitoring';
import { Color } from 'src/assets/theme';
import Constants from 'src/util/Constants';
import Toast from 'src/util/Toast';
import styles from './style';

const imageRequest = {
  cropping: Platform.OS === 'android',
  includeExif: true,
  freeStyleCropEnabled: true,
  compressImageMaxWidth: Constants.imageUploadMaxWidth,
  compressImageMaxHeight: Constants.imageUploadMaxHeight,
  mediaType: 'photo',
  forceJpg: true,
  hideBottomControls: false,
  cropperActiveWidgetColor: Color.darkBackground,
  cropperStatusBarColor: Color.darkBackground,
  cropperToolbarColor: Color.darkBackground,
};

@inject('draft')
@observer
class ActivityFeedFab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFabActive: false,
    };
  }

  toggleFab = () => {
    this.setState(prevState => ({ isFabActive: !prevState.isFabActive }));
  };

  usePhoto = async image => {
    const { draft, navigation } = this.props;
    await draft.initNewDraft();
    Monitoring.event(Event.CameraRollImageSelected);
    draft.updateImage({ uri: image.path });
    navigation.navigate(AppScreen.AddPhoto);
  };

  selectPhoto = async () => {
    this.setState({ isFabActive: false }, () => {
      ImagePicker.openPicker(imageRequest)
        .then(this.usePhoto)
        .catch(e => {
          if (e.code !== 'E_PICKER_CANCELLED') {
            Monitoring.exception(e, { message: 'Error caught while attempting to select photo' });
            Toast.danger(Copy.toast.genericError);
          }
        });
    });
  };

  takePhoto = async () => {
    this.setState({ isFabActive: false }, () => {
      ImagePicker.openCamera(imageRequest)
        .then(image => {
          CameraRoll.saveToCameraRoll(image.path);
          this.usePhoto(image);
        })
        .catch(e => {
          if (e.code !== 'E_PICKER_CANCELLED') {
            Monitoring.exception(e, { message: 'Error caught while attempting to take photo' });
            Toast.danger(Copy.toast.genericError);
          }
        });
    });
  };

  render() {
    const { isFabActive } = this.state;
    const { isFocused } = this.props;
    if (!isFocused) {
      return null;
    }
    return (
      <Fab active={isFabActive} direction="up" style={styles.fab} position="bottomRight" onPress={this.toggleFab}>
        <CopilotStepAddPhoto>
          <CopilotView style={styles.fabCopilot}>
            <Icon type="FontAwesome" name="plus" style={styles.fabIcon} />
          </CopilotView>
        </CopilotStepAddPhoto>
        {isFabActive && (
          <Button style={styles.fabImage} onPress={this.selectPhoto}>
            <Icon type="FontAwesome" name="image" />
          </Button>
        )}
        {isFabActive && (
          <Button style={styles.fabCamera} onPress={this.takePhoto}>
            <Icon type="FontAwesome" name="camera" />
          </Button>
        )}
      </Fab>
    );
  }
}

ActivityFeedFab.propTypes = {
  navigation: NavigationPropTypes.isRequired,
  isFocused: PropTypes.bool.isRequired,
};

ActivityFeedFab.wrappedComponent.propTypes = {
  draft: PropTypes.instanceOf(DraftActivityImageStore).isRequired,
};

export default withNavigation(withNavigationFocus(ActivityFeedFab));
