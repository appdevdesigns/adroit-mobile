import { StyleSheet } from 'react-native';
import Theme, { GridSize } from 'src/assets/theme';

export default StyleSheet.create({
  profilePic: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: GridSize * 2,
  },
});
