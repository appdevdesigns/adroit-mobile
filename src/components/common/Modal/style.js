import { StyleSheet } from 'react-native';
import Theme, { GridSize } from 'src/assets/theme';

const borderRadius = 4;

export default StyleSheet.create({
  outerWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: GridSize * 3,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: '100%',
  },
  wrapper: {
    flex: 0,
    backgroundColor: Theme.containerBgColor,
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
    color: Theme.inverseTextColor,
    fontWeight: 'bold',
  },
  content: {
    padding: GridSize * 2,
  },
});
