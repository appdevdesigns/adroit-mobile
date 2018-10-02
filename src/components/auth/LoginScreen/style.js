import { StyleSheet } from 'react-native';
import Color from 'color';
import Theme from '../../../assets/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color(Theme.toolbarDefaultBg).fade(0.25),
    justifyContent: 'center',
  },
  logo: {
    alignSelf: 'center',
    width: 63,
    height: 69,
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    alignSelf: 'center',
    marginBottom: 20,
    color: Theme.toolbarInputColor,
  },
  item: {
    marginLeft: 20,
    marginRight: 20,
  },
  input: {
    color: '#fff',
  },
  loginButton: {
    marginTop: 20,
    // marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  spinner: {
    margin: 40,
  },
});
