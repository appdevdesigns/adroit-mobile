import { StyleSheet } from 'react-native';
import { centerContent, square } from 'src/assets/style';
import Theme, { Color, GridSize } from 'src/assets/theme';

export default StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingBottom: 5,
    alignSelf: 'flex-start',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 8,
  },
  selectedWrapper: {
    flex: 1,
  },
  header: {
    backgroundColor: Theme.toolbarDefaultBg,
    flexDirection: 'row',
  },
  headerIcon: {
    color: Color.lightBackground,
  },
  icon: {
    flex: 0,
    fontSize: 17,
    marginLeft: GridSize,
    marginTop: 0,
    paddingRight: 0,
  },
  selected: {
    fontSize: 17,
    lineHeight: 20,
    color: '#000',
  },
  placeholder: {
    fontSize: 17,
    lineHeight: 20,
    color: Color.darkTextMuted,
  },
  itemIcon: {
    fontSize: 17,
    color: '#000',
  },
  item: {
    fontSize: 17,
    color: '#000',
  },
  noMatches: {
    padding: GridSize,
    paddingTop: GridSize * 2,
    flexDirection: 'column',
    alignItems: 'center',
  },
  filterListItem: {
    paddingRight: 0,
  },
  filterWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  filterIconWrapper: {
    ...centerContent,
    ...square(24),
  },
  filterInput: {
    height: 24,
    paddingLeft: GridSize * 1.5,
    paddingTop: 4,
    paddingBottom: 0,
  },
  filterCopy: {
    color: Color.darkTextSecondary,
    marginTop: GridSize,
  },
  noMatchesButton: {
    marginTop: GridSize,
    alignSelf: 'center',
  },
  separator: {
    height: 0.5,
    width: '100%',
    marginLeft: GridSize * 2,
    backgroundColor: Theme.listBorderColor,
  },
  doneButton: {
    backgroundColor: Theme.toolbarDefaultBg,
  },
});
