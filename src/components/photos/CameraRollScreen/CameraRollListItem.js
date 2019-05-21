import React from 'react';
import PropTypes from 'prop-types';
import AppScreen from 'src/components/app/AppScreen';
import { NavigationPropTypes } from 'src/util/PropTypes';
import { TouchableOpacity, Image, View } from 'react-native';
import { Icon } from 'native-base';
import styles from './style';

export const CAMERA_ITEM = {
  uri: 'CAMERA',
};

const CameraRollListItem = ({ item, index, navigation, openPreview }) => {
  const goToCamera = () => {
    navigation.navigate(AppScreen.Camera);
  };
  return (
    <TouchableOpacity
      onPress={() => {
        if (item === CAMERA_ITEM) {
          goToCamera();
        } else {
          openPreview(index);
        }
      }}
    >
      {item === CAMERA_ITEM ? (
        <View style={[styles.image, styles.iconWrapper]}>
          <Icon type="FontAwesome" name="camera" style={styles.cameraIcon} />
        </View>
      ) : (
        <Image style={styles.image} source={{ uri: item.uri }} resizeMode="cover" />
      )}
    </TouchableOpacity>
  );
};

CameraRollListItem.propTypes = {
  item: PropTypes.shape({
    uri: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  navigation: NavigationPropTypes.isRequired,
  openPreview: PropTypes.func.isRequired,
};

export default CameraRollListItem;
