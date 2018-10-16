import { StyleSheet } from 'react-native';
import { Color, GridSize } from 'src/assets/theme';

const centerContent = {
  alignItems: 'center',
  justifyContent: 'center',
};

export default StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  image: {
    backgroundColor: '#000',
    height: 150,
    resizeMode: 'contain',
  },
  main: {
    margin: GridSize,
  },
  item: {
    alignItems: 'flex-start',
    marginLeft: 0,
  },
  charCount: {
    position: 'absolute',
    top: 10,
    right: GridSize,
    fontSize: 10,
    color: Color.darkTextMuted,
  },
  input: {
    alignSelf: 'stretch',
  },
  date: {},
  textArea: {},
  textInput: {},
  spinner: {
    height: 45,
  },
  teamMember: {
    flexDirection: 'row',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  avatarIconWrapper: {
    backgroundColor: Color.lightBackground1,
    ...centerContent,
  },
  avatarIcon: {
    fontSize: 17,
  },
  currentLocationItem: {
    flexDirection: 'row',
  },
  currentLocationIconWrapper: {
    ...centerContent,
  },
  currentLocationIcon: {
    fontSize: 17,
    marginTop: 2,
  },
});
