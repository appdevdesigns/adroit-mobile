import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Image, View } from 'react-native';
import { Spinner, Icon } from 'native-base';
import ActivityImagesStore from 'src/store/ActivityImagesStore';
import { UploadStatus } from 'src/store/FileUploadStore';
import baseStyles from 'src/assets/style';
import styles from './style';

@inject('activityImages')
@observer
class PhotoUploadPreview extends React.Component {
  componentWillMount() {
    this.props.activityImages.uploadImage(this.props.image);
  }

  render() {
    const {
      image,
      activityImages: {
        photo: { uploadProgressPercent, status },
      },
    } = this.props;
    const iconBackgroundStyles = [styles.iconBackground];
    let iconName = 'upload';
    if (status === UploadStatus.succeeded) {
      iconBackgroundStyles.push(styles.iconBackgroundSuccess);
      iconName = 'check';
    } else if (status === UploadStatus.failed) {
      iconBackgroundStyles.push(styles.iconBackgroundFailed);
      iconName = 'exclamation-triangle';
    }
    return (
      <View style={styles.wrapper}>
        <Image resizeMode="contain" source={{ uri: image.uri }} style={styles.image} />
        <View style={baseStyles.centeredOverlay}>
          {status === UploadStatus.uploading ? (
            <Spinner style={styles.spinner} />
          ) : (
            <View style={iconBackgroundStyles} />
          )}
        </View>
        <View style={baseStyles.centeredOverlay}>
          <Icon style={styles.uploadIcon} type="FontAwesome" name={iconName} />
        </View>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${uploadProgressPercent}%` }]} />
        </View>
      </View>
    );
  }
}

PhotoUploadPreview.wrappedComponent.propTypes = {
  image: PropTypes.shape({
    uri: PropTypes.string,
  }).isRequired,
  activityImages: PropTypes.instanceOf(ActivityImagesStore).isRequired,
};

export default PhotoUploadPreview;
