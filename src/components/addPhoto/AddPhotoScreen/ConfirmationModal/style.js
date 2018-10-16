import { StyleSheet } from 'react-native';
import Theme, { Color, GridSize } from 'src/assets/theme';

export default StyleSheet.create({
  outerWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: GridSize * 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    flex: 0,
    backgroundColor: '#fff',
  },
  header: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: GridSize * 2,
    borderBottomColor: Theme.listBorderColor,
    borderBottomWidth: Theme.borderWidth,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    flex: 0,
    paddingTop: GridSize * 2,
    paddingBottom: GridSize * 2,
  },
  item: {
    alignItems: 'flex-start',
  },
  checkbox: {
    marginTop: 2,
  },
  itemBody: {
    paddingLeft: GridSize * 2,
  },
  label: {
    color: '#000',
  },
  context: {
    color: Color.darkTextMuted,
    marginTop: GridSize,
    fontSize: 14,
    lineHeight: 16,
    marginLeft: 0,
    marginRight: 0,
  },
  footer: {
    flexDirection: 'row',
    flex: 0,
    padding: GridSize * 2,
  },
  cancelButton: {
    flex: 0,
    marginRight: GridSize,
  },
  confirmButton: {
    flex: 0,
    marginLeft: GridSize,
  },
});
