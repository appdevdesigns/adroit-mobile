import { StyleSheet } from 'react-native';
import { GridSize } from 'src/assets/theme';

const toolbarImageHeight = 24;

export default StyleSheet.create({
  preview: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0)',
    flex: 1,
    justifyContent: 'space-between',
  },
  overlayItem: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingTop: GridSize,
    paddingBottom: GridSize,
    flexDirection: 'row',
    flex: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {},
  footer: {
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  captureIconWrapper: {
    backgroundColor: '#fff',
    borderRadius: 18,
  },
  captureIcon: {
    backgroundColor: 'transparent',
    color: '#000',
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 4,
    paddingRight: 4,
    fontSize: 32,
  },
  toolbarImage: {
    height: toolbarImageHeight,
    marginLeft: GridSize * 2,
    marginRight: GridSize * 2,
  },
  typeImage: {
    width: (toolbarImageHeight * 4) / 3,
  },
  flashImage: {
    width: toolbarImageHeight,
  },
});
