import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Image, View } from 'react-native';
import { Spinner, Icon } from 'native-base';
import ActivityImagesStore from 'src/store/ActivityImagesStore';
import styles from './style';

@inject('activityImages')
@observer
class PhotoUploadPreview extends React.Component {
  componentWillMount() {
    // this.props.activityImages.uploadImage(this.props.image);
  }

  render() {
    const { image, activityImages } = this.props;
    const progressPercent = activityImages.uploadProgressPercent;
    const iconStyles = [styles.spinner, styles.uploadIcon];
    if (activityImages.uploadedImageName) {
      iconStyles.push(styles.success);
    }
    return (
      <View style={styles.wrapper}>
        <Image source={{ uri: image.uri }} style={styles.image} />
        <View style={styles.spinnerContainer}>
          {!activityImages.uploadedImageName ? (
            <Spinner style={styles.spinner} />
          ) : (
            <View style={styles.iconBackground} />
          )}
        </View>
        <View style={styles.spinnerContainer}>
          <Icon style={iconStyles} type="FontAwesome" name={activityImages.uploadedImageName ? 'check' : 'upload'} />
        </View>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
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
