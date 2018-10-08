import { StyleSheet } from 'react-native';
import Theme, { Color } from 'src/assets/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.containerBgColor,
  },
  header: {
    backgroundColor: Theme.toolbarDefaultBg,
    paddingTop: 20,
    paddingBottom: 10,
  },
  username: {
    fontSize: 14,
    alignSelf: 'center',
    color: Color.lightTextMuted,
  },
  logo: {
    alignSelf: 'center',
    width: 150,
    height: 110,
    marginBottom: 10,
  },
  version: {
    alignSelf: 'flex-end',
    fontSize: 10,
    marginRight: 10,
    color: Color.lightTextMuted,
  },
});
