import { StyleSheet } from 'react-native';
import Theme, { Color, GridSize } from 'src/assets/theme';

export default StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    paddingRight: GridSize * 2,
    paddingTop: GridSize,
    paddingBottom: GridSize,
    paddingLeft: GridSize * 2,
    marginLeft: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  left: {
    flex: 0,
  },
  body: {
    flex: 1,
    marginLeft: GridSize * 2,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  imageWrapper: {
    backgroundColor: Color.darkBackground2,
    // borderRadius: 3,
    borderWidth: 3,
  },
  fab: {
    backgroundColor: Theme.toolbarDefaultBg,
  },
  fabImage: {
    backgroundColor: 'green',
  },
  fabCamera: {
    backgroundColor: 'darkblue',
  },
});
