import { StyleSheet } from 'react-native';
import { GridSize } from 'src/assets/theme';

export default StyleSheet.create({
  customMessage: {
    fontStyle: 'italic',
  },
  toFixItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toFixText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  toFixIcon: {
    color: 'red',
    marginRight: GridSize,
  },
  confirmButton: {
    marginTop: GridSize,
    alignSelf: 'center',
  },
  withBottomMargin: {
    marginBottom: GridSize,
  },
});
