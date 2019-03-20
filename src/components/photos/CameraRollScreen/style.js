import { StyleSheet, Dimensions } from 'react-native';
import Theme, { Color, GridSize } from 'src/assets/theme';

export const numColumns = 3;

const { width } = Dimensions.get('window');
const photoPadding = GridSize / 2;
const widthWithoutPadding = width - photoPadding * (numColumns + 1);
export const equalWidth = widthWithoutPadding / numColumns;

export const imageStyle = {
  margin: photoPadding / 2,
  height: equalWidth,
  width: equalWidth,
};

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
  image: { ...imageStyle },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.lightBackground1,
  },
  cameraIcon: {
    color: Color.darkTextMuted,
    fontSize: 38,
  },
  emptyButton: {
    alignSelf: 'center',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
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
