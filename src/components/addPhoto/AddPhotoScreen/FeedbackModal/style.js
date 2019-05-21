import { StyleSheet } from 'react-native';
import { GridSize } from 'src/assets/theme';

export default StyleSheet.create({
  feedbackModal: {
    flex: 1,
  },
  feedbackContent: {
    flex: 1,
  },
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
    marginTop: GridSize * 2,
    alignSelf: 'center',
  },
  withBottomMargin: {
    marginBottom: GridSize,
  },
  scrollView: {
    flex: 1,
  },
});
