import { StyleSheet } from 'react-native';
import Theme, { GridSize } from 'src/assets/theme';

export default StyleSheet.create({
  listItem: {
    paddingTop: GridSize * 2 - 6,
    paddingBottom: GridSize * 2 - 6,
  },
  modalText: {
    fontSize: 14,
  },
  input: {
    height: 20,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  addButton: {
    flex: 0,
  },
});
