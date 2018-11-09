import { StyleSheet } from 'react-native';
import Color from 'color';
import Theme, { GridSize, Color as ThemeColor } from 'src/assets/theme';

const topFontSize = 14;
const imageProgressHeight = 20;
const timeRemainingColor = '#227495';
const timeElapsedColor = '#064367';

export default StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
  },
  top: {
    borderColor: '#fff',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    flexDirection: 'row',
    backgroundColor: '#4c89a4',
  },
  topItem: {
    paddingTop: GridSize / 2,
    paddingBottom: GridSize / 2,
    paddingLeft: GridSize,
    paddingRight: GridSize,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topItemBordered: {
    borderRightColor: '#1f6b8d',
    borderRightWidth: 1,
  },
  topText: {
    color: '#fff',
    fontSize: topFontSize,
    lineHeight: topFontSize + 2,
    alignSelf: 'center',
    fontWeight: '600',
  },
  topIcon: {
    fontSize: topFontSize,
    color: '#fff',
    marginRight: GridSize / 2,
    alignSelf: 'center',
  },
  topIndicator: {
    width: topFontSize,
    height: topFontSize,
    borderRadius: topFontSize / 2,
    borderWidth: 1,
    marginRight: GridSize / 2,
    borderColor: '#fff',
    alignSelf: 'center',
  },
  timeRemaining: {
    backgroundColor: timeRemainingColor,
  },
  status: {
    flex: 1,
  },
  progressWrapper: {
    // backgroundColor: timeRemainingColor,
    height: GridSize * 2 + imageProgressHeight,
  },
  progress: {
    position: 'absolute',
    left: 0,
  },
  progressDate: {
    top: 0,
    bottom: 0,
    backgroundColor: timeElapsedColor,
    borderRightWidth: 3,
    borderRightColor: '#011529',
  },
  imagesProgress: {
    top: GridSize,
    height: imageProgressHeight,
  },
  approvedImages: {
    backgroundColor: ThemeColor.approvedImage,
  },
  newImages: {
    backgroundColor: ThemeColor.newImage,
  },
});
