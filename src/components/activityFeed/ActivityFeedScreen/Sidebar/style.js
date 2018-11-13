import { StyleSheet } from 'react-native';
import Theme, { GridSize, Color } from 'src/assets/theme';

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
  logo: {
    alignSelf: 'center',
    width: 150,
    height: 110,
    marginBottom: GridSize,
    marginTop: GridSize,
  },
  version: {
    alignSelf: 'flex-end',
    fontSize: 10,
    color: Color.lightTextMuted,
  },
});
