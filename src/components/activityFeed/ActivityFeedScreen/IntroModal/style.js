import { StyleSheet } from 'react-native';
import Color from 'color';
import { logoDim } from 'src/assets/style';
import Theme, { GridSize } from 'src/assets/theme';

export default StyleSheet.create({
  bgImage: {
    flex: 0,
    width: '100%',
    height: 170,
    marginBottom: GridSize * 2,
  },
  topContainer: {
    flex: 1,
    backgroundColor: Color(Theme.toolbarDefaultBg).fade(0.25),
    justifyContent: 'flex-start',
  },
  logo: {
    alignSelf: 'center',
    width: logoDim.width / 3,
    height: logoDim.height / 3,
    marginTop: 20,
    marginBottom: 20,
  },
  title1: {
    marginTop: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    fontSize: 17,
    lineHeight: 32,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: GridSize * 2,
    marginBottom: GridSize * 2,
  },
  cancelButton: {
    flex: 0,
    marginRight: GridSize,
  },
  confirmButton: {
    flex: 0,
    marginLeft: GridSize,
  },
  buttonText: {
    paddingLeft: GridSize,
    paddingRight: GridSize,
  },
});
