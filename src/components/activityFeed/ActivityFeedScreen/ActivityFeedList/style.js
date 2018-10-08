import { StyleSheet } from 'react-native';
import { Color } from 'src/assets/theme';

export default StyleSheet.create({
  date: {
    color: Color.lightTextMuted,
    fontSize: 12,
    marginBottom: 3.5,
  },
  thumbnail: {
    width: 80,
    height: 60,
  },
  activity: {
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 0,
    marginRight: 0,
  },
  team: {
    fontSize: 12,
    color: Color.darkTextMuted,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 4,
  },
  caption: {
    fontSize: 12,
    lineHeight: 14,
    marginLeft: 0,
    marginRight: 0,
    color: Color.darkTextSecondary,
  },
});
