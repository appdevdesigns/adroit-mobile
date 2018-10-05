import { StyleSheet } from 'react-native';
import { Color, GridSize } from 'src/assets/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10%',
  },
  icon: {
    fontSize: 64,
    marginBottom: GridSize * 2,
  },
  title: {
    fontSize: 32,
    marginBottom: GridSize,
  },
  message: {
    fontSize: 20,
    marginBottom: GridSize,
    color: Color.darkTextSecondary,
    textAlign: 'center',
  },
});
