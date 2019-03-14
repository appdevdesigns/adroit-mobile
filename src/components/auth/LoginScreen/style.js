import { StyleSheet } from 'react-native';
import Color from 'color';
import Theme, { Color as ThemeColor } from 'src/assets/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color(Theme.toolbarDefaultBg).fade(0.25),
    justifyContent: 'flex-start',
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: Theme.isIphoneX ? 40 + Theme.Inset.portrait.topInset : 40,
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
  inputIcon: {
    color: ThemeColor.lightTextMuted,
    paddingBottom: 10, // Hack to align with Input text
  },
  input: {
    color: Theme.inverseTextColor,
  },
  loginButton: {
    marginTop: 10,
  },
  spinner: {
    margin: 40,
  },
});
