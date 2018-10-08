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
    flex: 1,
  },
  date: {
    marginTop: 4,
  },
  textArea: {
    fontSize: 17,
    marginTop: 4,
  },
  textInput: {
    marginLeft: 4,
  },
  footer: {
    justifyContent: 'space-between',
  },
  footerButton: {
    flex: 0,
  },
  spinner: {
    height: 45,
    flex: 0,
  },
});
