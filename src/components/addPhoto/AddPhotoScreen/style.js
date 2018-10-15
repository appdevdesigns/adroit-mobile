import { StyleSheet } from 'react-native';
import { Color, GridSize } from 'src/assets/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  image: {
    backgroundColor: '#000',
    height: 150,
    resizeMode: 'contain',
  },
  main: {
    margin: GridSize,
  },
  item: {
    alignItems: 'flex-start',
    marginLeft: 0,
  },
  charCount: {
    position: 'absolute',
    top: 10,
    right: GridSize,
    fontSize: 10,
    color: Color.darkTextMuted,
  },
  row: {
    // flex: 1,
    flexDirection: 'row',
  },
  iconWrapper: {
    marginTop: 10,
    flex: 0,
    width: 36,
    alignItems: 'center',
  },
  icon: {
    color: '#999',
  },
  input: {
    alignSelf: 'stretch',
  },
  date: {
    marginTop: 4,
  },
  textArea: {},
  textInput: {
    paddingLeft: 10, // Match other NativeBase inputs
  },
  footer: {
    justifyContent: 'space-between',
  },
  footerButton: {
    flex: 0,
  },
  spinner: {
    height: 45,
  },
});
