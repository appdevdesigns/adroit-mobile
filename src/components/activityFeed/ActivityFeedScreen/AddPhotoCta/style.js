import { StyleSheet } from 'react-native';
import { Color } from 'src/assets/theme';

export default StyleSheet.create({
  container: {
    backgroundColor: Color.lightBackground1,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 86,
    width: 86,
  },
  icon: {
    fontSize: 48,
    color: '#fff',
  },
  body: {
    justifyContent: 'center',
  },
  label: {
    fontSize: 20,
    color: Color.darkTextSecondary,
  },
});
