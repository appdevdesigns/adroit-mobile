import { StyleSheet } from 'react-native';
import Theme, { Color, GridSize } from 'src/assets/theme';

export default StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  introWrapper: {
    padding: GridSize * 2,
    justifyContent: 'center',
    backgroundColor: Color.lightBackground1,
    alignSelf: 'stretch',
  },
  introText: {
    fontSize: Theme.fontSizeBase * 1.2,
    textAlign: 'center',
  },
  emailButton: {
    alignSelf: 'center',
  },
  emailText: {
    marginTop: GridSize * 4,
    color: Color.darkTextSecondary,
    marginBottom: GridSize * 4,
  },
});
