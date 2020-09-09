import { StyleSheet } from 'react-native';
import Theme, { Color, GridSize } from 'src/assets/theme';

export default StyleSheet.create({
  main: {
    padding: GridSize,
    backgroundColor: Color.lightBackground1,
  },
  card: {
    margin: GridSize,
  },
  cardHeader: {
    paddingTop: GridSize,
    paddingBottom: GridSize/2,
  },
  cardItem: {
    paddingTop: GridSize/2,
    paddingBottom: GridSize/2,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 0,
  },
  section: {
    paddingTop: GridSize/2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionDescription: {
    fontSize: 11,
    color: Color.darkTextMuted,
    marginBottom: GridSize,
  },
  labelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkIcon: {
    marginLeft: GridSize,
    fontSize: 12,
    color: Theme.brandInfo,
  },
  label: {
    fontSize: 12,
    color: Color.darkTextMuted,
  },
  charCount: {
    position: 'absolute',
    top: 8,
    right: 8 + GridSize,
    fontSize: 10,
    color: Color.darkTextMuted,
  },
  input: {
    alignSelf: 'stretch',
    paddingLeft: 0,
    paddingRight: 0,
    // backgroundColor: Color.lightBackground1,
  },
  dateContent: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dateWrapper: {
    flex: 1,
  },
  // Work-around weird padding priority issue with RN styles
  date: {
    padding: 0,
    paddingLeft: 0,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  buttonText: {
    paddingLeft: 0,
  },
  checkboxList: {
    paddingBottom: GridSize,
  },
  checkboxRow: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
  },
  checkbox: {
    flex: 0,
    marginTop: 4,
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: 20,   // HACK: Make room for checkbox
    marginRight: 20,
    fontSize: 12,
    flexWrap: 'wrap',
  },
  footerButton: {
    flexDirection: 'row',
  },
});
