import { StyleSheet } from 'react-native';
import { round } from 'src/assets/style';
import { Color, GridSize } from 'src/assets/theme';

const centerContent = {
  alignItems: 'center',
  justifyContent: 'center',
};

export default StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  main: {
    margin: GridSize,
  },
  item: {
    alignItems: 'flex-start',
    marginLeft: 0,
  },
  label: {
    fontSize: 12,
    color: Color.darkTextMuted,
  },
  charCount: {
    position: 'absolute',
    top: 10,
    right: GridSize,
    fontSize: 10,
    color: Color.darkTextMuted,
  },
  input: {
    alignSelf: 'stretch',
    paddingLeft: 0,
  },
  // Work-around weird padding priority issue with RN styles
  date: {
    padding: 0,
    paddingLeft: 0,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  spinner: {
    height: 45,
  },
  teamMember: {
    flexDirection: 'row',
  },
  avatarIconWrapper: {
    backgroundColor: Color.lightBackground1,
    ...centerContent,
    ...round(24),
  },
  centeredRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarIcon: {
    fontSize: 17,
    marginTop: 0,
  },
  locationIcon: {
    marginTop: 2, // Tweak to align better with text
  },
});
