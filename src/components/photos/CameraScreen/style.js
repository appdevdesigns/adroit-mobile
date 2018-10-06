import { StyleSheet } from 'react-native';
import { GridSize } from 'src/assets/theme';

export default StyleSheet.create({
  preview: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flex: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: GridSize * 2,
    paddingBottom: GridSize * 2,
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
