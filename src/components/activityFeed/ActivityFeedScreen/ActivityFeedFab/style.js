import { StyleSheet } from 'react-native';
import Theme from 'src/assets/theme';

export default StyleSheet.create({
  fab: {
    backgroundColor: Theme.toolbarDefaultBg,
  },
  fabImage: {
    backgroundColor: 'green',
  },
  fabCamera: {
    backgroundColor: 'darkblue',
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
