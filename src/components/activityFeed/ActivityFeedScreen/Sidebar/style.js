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
  logo: {
    alignSelf: 'center',
    width: 63,
    height: 69,
  },
});
