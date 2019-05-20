import { StyleSheet } from 'react-native';
import { GridSize } from 'src/assets/theme';

export default StyleSheet.create({
  customMessage: {
    fontStyle: 'italic',
  },
  toFixItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: GridSize,
  },
  toFixText: {
    fontSize: 14,
  },
  confirmButton: {
    marginTop: GridSize,
    alignSelf: 'center',
  },
  withBottomMargin: {
    marginBottom: GridSize,
  },
});
