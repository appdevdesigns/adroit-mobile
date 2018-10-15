import { StyleSheet } from 'react-native';
import Theme, { Color, GridSize } from 'src/assets/theme';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  placeholder: {
    color: Color.darkTextMuted,
    flex: 1,
  },
  items: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 10,
    paddingLeft: GridSize,
    paddingBottom: GridSize / 2,
  },
  itemTag: {
    marginLeft: GridSize / 2,
    marginRight: GridSize / 2,
    borderColor: Color.darkTextSecondary,
    marginBottom: GridSize / 2,
    borderRadius: 4,
  },
  itemTagText: {
    color: Color.darkTextSecondary,
  },
  itemTagIcon: {
    color: Color.darkTextSecondary,
  },
  button: {
    flex: 0,
  },
  buttonIcon: {
    color: '#8F8E95',
    fontSize: 16,
    marginRight: 2,
  },
  modal: {
    backgroundColor: 'white',
    flex: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
  },
  modalCloseButtonIcon: {
    color: Color.darkTextSecondary,
  },
  modalHeader: {
    flexDirection: 'row',
  },
  modalHeaderTitle: {
    fontSize: 20,
  },
  list: {
    padding: GridSize * 2,
    alignSelf: 'stretch',
  },
  listItemText: {
    paddingLeft: GridSize,
  },
});
