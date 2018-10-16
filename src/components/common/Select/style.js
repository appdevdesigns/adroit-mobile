import { StyleSheet } from 'react-native';
import { Color, GridSize } from 'src/assets/theme';

export default StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingBottom: 5,
    alignSelf: 'flex-start',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 8,
  },
  selectedWrapper: {
    flex: 1,
  },
  icon: {
    fontSize: 17,
    marginLeft: GridSize,
    marginTop: 0,
    paddingRight: 0,
  },
  selected: {
    fontSize: 17,
    lineHeight: 20,
    color: '#000',
  },
  placeholder: {
    fontSize: 17,
    lineHeight: 20,
    color: Color.darkTextMuted,
  },
  itemIcon: {
    fontSize: 17,
    color: '#000',
  },
  item: {
    fontSize: 17,
    color: '#000',
  },
  headerBody: {
    flex: 1,
    alignItems: 'center',
  },
  headerSide: {
    flex: 0,
    minWidth: 50,
  },
});
