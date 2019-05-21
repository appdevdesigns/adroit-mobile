import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import ImageResizer from 'react-native-image-resizer';
import ImageViewer from 'react-native-image-zoom-viewer';
import { View, Modal } from 'react-native';
import { Text, Button, Icon, Left, Right } from 'native-base';
import DraftActivityImageStore from 'src/store/DraftActivityImageStore';
import Copy from 'src/assets/Copy';
import baseStyles from 'src/assets/style';
import Monitoring, { Event } from 'src/util/Monitoring';
import AppScreen from 'src/components/app/AppScreen';
import Constants from 'src/util/Constants';
import { NavigationPropTypes } from 'src/util/PropTypes';
import styles from './style';

@inject('draft')
@observer
class ImagePreview extends React.Component {
  render() {
    const { photoItems, previewImageIndex, closePreview, navigation, draft } = this.props;
    return (
      <Modal visible={previewImageIndex !== null} transparent onRequestClose={closePreview}>
        <ImageViewer
          imageUrls={[{ props: { source: photoItems[previewImageIndex] } }]}
          index={0}
          saveToLocalByLongPress={false}
          onCancel={closePreview}
          enableSwipeDown
          onSwipeDown={closePreview}
          renderIndicator={() => null}
          renderHeader={() => (
            <View style={[baseStyles.manualHeader, styles.previewHeader]}>
              <Left>
                <Button transparent onPress={closePreview}>
                  <Icon type="FontAwesome" name="chevron-left" style={styles.closePreview} />
                </Button>
              </Left>
              <Right>
                <Button
                  bordered
                  light
                  onPress={() => {
                    ImageResizer.createResizedImage(
                      photoItems[previewImageIndex].uri,
                      Constants.imageUploadMaxWidth,
                      Constants.imageUploadMaxHeight,
                      'JPEG',
                      100,
                      0
                    )
                      .then(resized => {
                        closePreview();
                        Monitoring.event(Event.CameraRollImageSelected);
                        draft.updateImage(resized);
                        navigation.navigate(AppScreen.AddPhoto);
                      })
                      .catch(err => {
                        Monitoring.exception(err, { problem: 'Could not resize photo' });
                      });
                  }}
                >
                  <Text>{Copy.useThisPhotoButtonText}</Text>
                </Button>
              </Right>
            </View>
          )}
        />
      </Modal>
    );
  }
}

ImagePreview.propTypes = {
  photoItems: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  previewImageIndex: PropTypes.number,
  closePreview: PropTypes.func.isRequired,
  navigation: NavigationPropTypes.isRequired,
};

ImagePreview.defaultProps = {
  previewImageIndex: null,
};

ImagePreview.wrappedComponent.propTypes = {
  draft: PropTypes.instanceOf(DraftActivityImageStore).isRequired,
};

export default ImagePreview;
