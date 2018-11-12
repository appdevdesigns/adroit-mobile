import { StyleSheet } from 'react-native';
import Theme, { Color, GridSize } from 'src/assets/theme';

export default StyleSheet.create({
  item: {
    alignItems: 'flex-start',
    marginLeft: 0,
  },
  checkbox: {
    marginTop: 2,
  },
  itemBody: {
    paddingLeft: GridSize * 2,
  },
  label: {
    color: '#000',
    fontSize: 16,
  },
  context: {
    color: Color.darkTextMuted,
    marginTop: GridSize,
    fontSize: 12,
    lineHeight: 15,
    marginLeft: 0,
    marginRight: 0,
  },
  footer: {
    flexDirection: 'row',
    paddingTop: GridSize * 2,
  },
  cancelButton: {
    flex: 0,
    marginRight: GridSize,
  },
  confirmButton: {
    flex: 0,
    marginLeft: GridSize,
  },
  buttonText: {
    paddingLeft: 0,
  },
  scrollContainer: {
    flexGrow: 0,
  },
});
