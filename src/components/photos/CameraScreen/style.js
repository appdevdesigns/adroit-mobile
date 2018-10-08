import { StyleSheet } from 'react-native';
import { GridSize } from 'src/assets/theme';

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
  },
  header: {},
  footer: {
    backgroundColor: 'rgba(0,0,0,0)',
  },
  captureIcon: {
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 18,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 4,
    paddingRight: 4,
    fontSize: 32,
  },
});
