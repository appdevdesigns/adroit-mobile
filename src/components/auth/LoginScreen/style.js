import { StyleSheet } from 'react-native';
import Color from 'color';
import Theme from 'src/assets/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color(Theme.toolbarDefaultBg).fade(0.25),
    justifyContent: 'center',
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  logo: {
    alignSelf: 'center',
    width: 200,
    height: 146,
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    alignSelf: 'center',
    marginBottom: 20,
    color: Theme.toolbarInputColor,
  },
  item: {
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 10,
  },
  input: {
    color: '#fff',
  },
  loginButton: {
    marginTop: 10,
  },
  spinner: {
    margin: 40,
  },
});
