import React from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { inject, observer } from 'mobx-react';
import { Image, View, TouchableOpacity } from 'react-native';
import { Spinner, Icon } from 'native-base';
import AppScreen from 'src/components/app/AppScreen';
import { NavigationPropTypes } from 'src/util/PropTypes';
import DraftActivityImageStore, { UploadStatus } from 'src/store/DraftActivityImageStore';
import baseStyles from 'src/assets/style';
import styles from './style';

@inject('draft')
@observer
class PhotoUploadPreview extends React.Component {
  changeImage = () => {
    this.props.navigation.navigate(AppScreen.Photos);
  };

  render() {
    const {
      draft: { image, uploadProgressPercent, uploadStatus, fixPhoto, uploadImage },
    } = this.props;
    return (
      <View style={styles.wrapper}>
        <Image resizeMode="contain" source={{ uri: image.uri }} style={styles.image} />
        <View style={baseStyles.centeredOverlay}>
          {uploadStatus === UploadStatus.failed && (
            <TouchableOpacity style={[styles.iconBackground, styles.iconBackgroundFailed]} onPress={uploadImage}>
              <Icon style={styles.uploadIcon} type="FontAwesome" name="repeat" />
            </TouchableOpacity>
          )}
          {!fixPhoto && uploadStatus === UploadStatus.succeeded && (
            <View style={[styles.iconBackground, styles.iconBackgroundSuccess]}>
              <Icon style={styles.uploadIcon} type="FontAwesome" name="check" />
            </View>
          )}
          {uploadStatus === UploadStatus.uploading && <Spinner style={styles.spinner} />}
        </View>
        {uploadStatus === UploadStatus.uploading && (
          <View style={baseStyles.centeredOverlay}>
            <Icon style={styles.uploadIcon} type="FontAwesome" name="upload" />
          </View>
        )}
        {!fixPhoto && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${uploadProgressPercent}%` }]} />
          </View>
        )}
        {fixPhoto && (
          <View style={baseStyles.centeredOverlay}>
            <TouchableOpacity style={[styles.iconBackground, styles.iconBackgroundFailed]} onPress={this.changeImage}>
              <Icon style={styles.uploadIcon} type="FontAwesome" name="edit" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

PhotoUploadPreview.propTypes = {
  navigation: NavigationPropTypes.isRequired,
};

PhotoUploadPreview.wrappedComponent.propTypes = {
  draft: PropTypes.instanceOf(DraftActivityImageStore).isRequired,
};

export default withNavigation(PhotoUploadPreview);
