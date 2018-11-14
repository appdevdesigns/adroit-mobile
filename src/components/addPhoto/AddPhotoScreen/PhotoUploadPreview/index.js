import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Image, View } from 'react-native';
import { Spinner, Icon } from 'native-base';
import ActivityImagesStore from 'src/store/ActivityImagesStore';
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
      activityImages: { uploadProgressPercent, uploadedImageName },
    } = this.props;
    const iconStyles = [styles.uploadIcon];
    if (uploadedImageName) {
      iconStyles.push(styles.success);
    }
    return (
      <View style={styles.wrapper}>
        <Image resizeMode="contain" source={{ uri: image.uri }} style={styles.image} />
        <View style={baseStyles.centeredOverlay}>
          {!uploadedImageName ? <Spinner style={styles.spinner} /> : <View style={styles.iconBackground} />}
        </View>
        <View style={baseStyles.centeredOverlay}>
          <Icon style={iconStyles} type="FontAwesome" name={uploadedImageName ? 'check' : 'upload'} />
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
