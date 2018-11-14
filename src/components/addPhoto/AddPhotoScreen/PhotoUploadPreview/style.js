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
  uploadIcon: {
    color: Color.lightTextMuted,
    fontSize: 14,
  },
  success: {
    color: Theme.inverseTextColor,
  },
  failed: {
    color: Theme.brandDanger,
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
