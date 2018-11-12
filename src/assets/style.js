import { StyleSheet } from 'react-native';
import Theme, { GridSize, Color } from 'src/assets/theme';

const listItemFontSize = 17;

export default StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: GridSize * 2,
    borderBottomColor: Theme.listBorderColor,
    borderBottomWidth: 0.5,
    paddingTop: GridSize * 2,
    paddingBottom: GridSize * 2,
    paddingRight: 0,
    backgroundColor: 'transparent',
  },
  listItemIcon: {
    fontSize: listItemFontSize,
    flex: 0,
    color: Theme.textColor,
  },
  listItemText: {
    fontSize: listItemFontSize,
    flex: 1,
    color: Theme.textColor,
  },
  marginRight: {
    marginRight: GridSize,
  },
  marginLeft: {
    marginLeft: GridSize,
  },
  doubleMarginRight: {
    marginRight: GridSize * 2,
  },
  doublMarginLeft: {
    marginLeft: GridSize * 2,
  },
  paragraph: {
    marginBottom: GridSize,
  },
});