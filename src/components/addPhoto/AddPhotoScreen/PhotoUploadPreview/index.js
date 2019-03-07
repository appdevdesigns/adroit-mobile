import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Image, View, TouchableOpacity } from 'react-native';
import { Spinner, Icon } from 'native-base';
import DraftActivityImageStore, { UploadStatus } from 'src/store/DraftActivityImageStore';
import baseStyles from 'src/assets/style';
import styles from './style';

@inject('draft')
@observer
class PhotoUploadPreview extends React.Component {
  componentWillMount() {
    this.initUpload();
  }

  initUpload = () => {
    const { draft } = this.props;
    if (draft.isNew) {
      this.props.draft.uploadImage();
    }
  };

  render() {
    const {
      draft: { isNew, image, uploadProgressPercent, uploadStatus },
    } = this.props;
    return (
      <View style={styles.wrapper}>
        <Image resizeMode="contain" source={{ uri: image.uri }} style={styles.image} />
        {isNew && (
          <View style={baseStyles.centeredOverlay}>
            {uploadStatus === UploadStatus.failed && (
              <TouchableOpacity style={[styles.iconBackground, styles.iconBackgroundFailed]} onPress={this.initUpload}>
                <Icon style={styles.uploadIcon} type="FontAwesome" name="repeat" />
              </TouchableOpacity>
            )}
            {uploadStatus === UploadStatus.succeeded && (
              <View style={[styles.iconBackground, styles.iconBackgroundSuccess]}>
                <Icon style={styles.uploadIcon} type="FontAwesome" name="check" />
              </View>
            )}
            {uploadStatus === UploadStatus.uploading && <Spinner style={styles.spinner} />}
          </View>
        )}
        {isNew && uploadStatus === UploadStatus.uploading && (
          <View style={baseStyles.centeredOverlay}>
            <Icon style={styles.uploadIcon} type="FontAwesome" name="upload" />
          </View>
        )}
        {isNew && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${uploadProgressPercent}%` }]} />
          </View>
        )}
      </View>
    );
  }
}

PhotoUploadPreview.wrappedComponent.propTypes = {
  draft: PropTypes.instanceOf(DraftActivityImageStore).isRequired,
};

export default PhotoUploadPreview;
