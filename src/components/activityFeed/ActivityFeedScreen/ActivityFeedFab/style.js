import { StyleSheet } from 'react-native';
import Theme from 'src/assets/theme';

export default StyleSheet.create({
  fab: {
    backgroundColor: Theme.toolbarDefaultBg,
  },
  fabCopilot: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    color: '#fff',
  },
});
