import { StyleSheet } from 'react-native';
import Theme, { GridSize, Color } from 'src/assets/theme';
import { logoDim } from 'src/assets/style';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.containerBgColor,
  },
  header: {
    backgroundColor: Theme.toolbarDefaultBg,
    padding: GridSize,
  },
  username: {
    fontSize: 14,
    alignSelf: 'center',
    color: Color.lightTextMuted,
  },
  menuIcon: {
    fontSize: 23,
  },
  logo: {
    alignSelf: 'center',
    width: logoDim.width / 3,
    height: logoDim.height / 3,
    marginBottom: GridSize,
    marginTop: Theme.isIphoneX ? GridSize * 2 + Theme.Inset.portrait.topInset : GridSize * 2,
  },
  version: {
    alignSelf: 'flex-end',
    fontSize: 10,
    color: Color.lightTextMuted,
  },
});
