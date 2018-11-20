import { StyleSheet } from 'react-native';
import Theme, { Color } from 'src/assets/theme';

const uploadIconSize = 34;

export default StyleSheet.create({
  wrapper: {
    backgroundColor: Theme.brandDark,
    height: 150,
  },
  image: {
    height: '100%',
  },
  iconBackground: {
    backgroundColor: Theme.defaultProgressColor,
    height: uploadIconSize,
    width: uploadIconSize,
    borderRadius: uploadIconSize / 2,
  },
  iconBackgroundSuccess: {
    backgroundColor: Theme.brandSuccess,
  },
  iconBackgroundFailed: {
    backgroundColor: Theme.brandDanger,
  },
  uploadIcon: {
    color: Theme.inverseTextColor,
    fontSize: 14,
  },
  progressContainer: {
    position: 'absolute',
    height: 5,
    left: 0,
    right: 0,
    bottom: 0,
  },
  progressBar: {
    backgroundColor: Theme.defaultProgressColor,
    height: '100%',
  },
});
