import { StyleSheet } from 'react-native';
import Theme from '../../../assets/theme';

const { Color } = Theme;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Background1,
    justifyContent: 'center',
  },
  logo: {
    alignSelf: 'center',
    width: 63,
    height: 69,
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    alignSelf: 'center',
    marginBottom: 20,
    color: Color.Foreground1,
  },
  item: {
    marginLeft: 20,
    marginRight: 20,
  },
  input: {
    color: '#fff',
  },
  loginButton: {
    marginTop: 20,
    // marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  spinner: {
    margin: 40,
  },
});
