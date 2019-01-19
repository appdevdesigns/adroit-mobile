import { StyleSheet, Dimensions } from 'react-native';
import Theme, { Color, GridSize } from 'src/assets/theme';

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
  previewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: GridSize,
    alignItems: 'center',
    paddingBottom: Theme.isIphoneX ? GridSize + Theme.Inset.portrait.bottomInset : GridSize,
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
