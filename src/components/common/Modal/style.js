import { StyleSheet } from 'react-native';
import Color from 'color';
import Theme, { GridSize, Color as ThemeColor } from 'src/assets/theme';

const borderRadius = 4;

export default StyleSheet.create({
  outerWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: GridSize * 3,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: '90%',
  },
  wrapper: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius,
  },
  closeButton: {
    marginLeft: GridSize,
  },
  closeButtonIcon: {
    marginRight: 0,
  },
  header: {
    backgroundColor: Theme.toolbarDefaultBg,
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: GridSize * 2,
    paddingRight: GridSize * 2,
    paddingTop: GridSize,
    paddingBottom: GridSize,
    borderBottomColor: Theme.listBorderColor,
    borderBottomWidth: Theme.borderWidth,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    padding: GridSize * 2,
  },
});
