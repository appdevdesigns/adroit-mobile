import { StyleSheet } from 'react-native';
import Theme, { Color } from '../../../../assets/theme';

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
  title: {
    fontSize: 40,
    alignSelf: 'center',
    color: Theme.toolbarInputColor,
  },
  logo: {
    alignSelf: 'center',
    width: 63,
    height: 69,
    paddingBottom: 10,
  },
  version: {
    alignSelf: 'flex-end',
    fontSize: 10,
    marginRight: 10,
    color: Color.lightTextMuted,
  },
});
