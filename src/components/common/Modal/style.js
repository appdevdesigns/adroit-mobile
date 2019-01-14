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
    backgroundColor: Theme.containerBgColor,
    borderRadius,
    maxHeight: '100%',
  },
  closeButton: {
    position: 'absolute',
    marginLeft: GridSize,
    right: GridSize * 2,
  },
  closeButtonIcon: {
    marginRight: 0,
  },
  header: {
    backgroundColor: Theme.toolbarDefaultBg,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingLeft: GridSize * 3,
    paddingRight: GridSize * 3,
  },
  content: {
    padding: GridSize * 2,
    flexDirection: 'column',
  },
});
