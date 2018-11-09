import { StyleSheet } from 'react-native';
import Theme, { Color } from 'src/assets/theme';

export default StyleSheet.create({
  wrapper: {
    backgroundColor: '#000',
    height: 150,
  },
  image: {
    resizeMode: 'contain',
    height: '100%',
  },
  spinnerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {},
  iconBackground: {
    backgroundColor: '#45D56E',
    height: 34,
    width: 34,
    borderRadius: 17,
  },
  uploadIcon: {
    color: '#ccc',
    fontSize: 14,
  },
  success: {
    color: '#fff',
  },
  failed: {
    color: 'red',
  },
  progressContainer: {
    position: 'absolute',
    height: 5,
    left: 0,
    right: 0,
    bottom: 0,
  },
  progressBar: {
    backgroundColor: '#45D56E',
    height: '100%',
  },
});
