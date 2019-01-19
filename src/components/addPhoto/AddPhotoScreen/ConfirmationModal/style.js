import { StyleSheet } from 'react-native';
import Theme, { Color, GridSize } from 'src/assets/theme';

export default StyleSheet.create({
  list: {
    flex: 0,
    flexDirection: 'column',
  },
  item: { 
    flex: 0, 
    flexDirection: 'row', 
    marginBottom: GridSize * 2,
  },
  checkbox: {
    marginTop: 2,
    left: 0,
  },
  itemBody: {
    marginLeft: GridSize * 2,
    marginRight: GridSize * 2,
  },
  label: {
    color: Theme.textColor,
    fontSize: Theme.DefaultFontSize,
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
    flex: 0,
    flexDirection: 'row',
    flexShrink: 0,
    justifyContent: 'center',
    // marginBottom: GridSize * 2,
  },
  cancelButton: {
    flex: 1,
    marginRight: GridSize,
  },
  confirmButton: {
    flex: 1,
    marginLeft: GridSize,
  },
  buttonText: {
    paddingLeft: 0,
  },
  scrollContainer: {
    maxHeight: 100,
  },
});
