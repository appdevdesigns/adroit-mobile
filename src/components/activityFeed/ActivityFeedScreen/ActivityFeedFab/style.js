import { StyleSheet } from 'react-native';
import Theme, { Color } from 'src/assets/theme';

export default StyleSheet.create({
  fab: {
    backgroundColor: Theme.toolbarDefaultBg,
  },
  fabImage: {
    backgroundColor: Color.darkAltPrimary,
  },
  fabCamera: {
    backgroundColor: Color.darkAltSecondary,
  },
  fabCopilot: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    color: Color.lightBackground,
  },
});
