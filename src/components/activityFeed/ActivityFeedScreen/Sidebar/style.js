import { StyleSheet } from 'react-native';
import Theme from '../../../../assets/theme';

const { Color } = Theme;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.BackgroundAlt1,
  },
  header: {
    backgroundColor: Color.Background1,
    paddingTop: 20,
    paddingBottom: 10,
  },
  logo: {
    alignSelf: 'center',
    width: 63,
    height: 69,
  },
});
