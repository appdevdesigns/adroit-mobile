import { StyleSheet, Dimensions } from 'react-native';
import Theme, { GridSize, AdroitHeaderHeight } from 'src/assets/theme';

export const numColumns = 3;

const { width } = Dimensions.get('window');
const photoPadding = GridSize;
const widthWithoutPadding = width - photoPadding * (numColumns + 1);
export const equalWidth = widthWithoutPadding / numColumns;

export default StyleSheet.create({
  spinner: {
    alignSelf: 'center',
  },
  list: {
    padding: photoPadding / 2,
  },
  placeholderContainer: {
    margin: photoPadding / 2,
  },
  image: {
    margin: photoPadding / 2,
    height: equalWidth,
    width: equalWidth,
  },
  emptyButton: {
    alignSelf: 'center',
  },
  previewHeader: {
    height: AdroitHeaderHeight,
    backgroundColor: 'transparent',
    paddingTop: Theme.isIphoneX ? 42 : 0,
  },
  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    flexDirection: 'row',
  },
  closePreview: {
    color: '#fff',
  },
  footerText: {
    opacity: 0.7,
    marginLeft: 8,
  },
});
