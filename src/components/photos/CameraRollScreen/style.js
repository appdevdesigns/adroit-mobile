import { StyleSheet, Dimensions } from 'react-native';
import { Color, GridSize } from 'src/assets/theme';

export const numColumns = 3;

const { width } = Dimensions.get('window');
const photoPadding = GridSize;
const widthWithoutPadding = width - photoPadding * (numColumns + 1);
const equalWidth = widthWithoutPadding / numColumns;

export default StyleSheet.create({
  spinner: {
    alignSelf: 'center',
  },
  list: {
    padding: photoPadding / 2,
  },
  image: {
    margin: photoPadding / 2,
    height: equalWidth,
    width: equalWidth,
  },
  empty: {
    alignSelf: 'center',
    paddingTop: 20,
    fontSize: 20,
    color: Color.darkTextMuted,
  },
});
