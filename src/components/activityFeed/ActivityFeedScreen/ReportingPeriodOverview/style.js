import { StyleSheet } from 'react-native';
import Theme, { IsSmallScreen, GridSize, Color } from 'src/assets/theme';

const topFontSize = 12;
const imageProgressHeight = 20;
const timeRemainingColor = '#227495';
const timeElapsedColor = '#064367';
const currentDateBarColor = '#011529';
const topItemDividerColor = '#1f6b8d';
const topItemBackgroundColor = '#4c89a4';
const topItemColor = Theme.inverseTextColor;

export const Gradients = {
  approved: ['#23ad9d', '#1cd7cf'],
  new: ['#393939', '#535353'],
};

const flexValues = IsSmallScreen
  ? {
      approvedStep: {
        flex: 0.742,
        flexBasis: 75,
      },
      newStep: {
        flex: 0.713,
        flexBasis: 72,
      },
      daysLeftStep: {
        flex: 1,
        flexBasis: 101,
      },
      statusStep: {
        flex: 0.307,
        flexBasis: 31,
      },
    }
  : {
      approvedStep: {
        flexBasis: 105.5,
        flex: 0.933,
      },
      newStep: {
        flexBasis: 72.5,
        flex: 0.641,
      },
      daysLeftStep: {
        flexBasis: 113,
        flex: 1,
      },
      statusStep: {
        flexBasis: 83,
        flex: 0.734,
      },
    };

export default StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
  },
  top: {
    borderColor: topItemColor,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    flexDirection: 'row',
    backgroundColor: topItemBackgroundColor,
  },
  topItemStep: {
    flexGrow: 1,
    flexShrink: 1,
  },
  approvedStep: {
    ...flexValues.approvedStep,
  },
  newStep: {
    ...flexValues.newStep,
  },
  daysLeftStep: {
    ...flexValues.daysLeftStep,
  },
  statusStep: {
    ...flexValues.statusStep,
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
    borderRightColor: topItemDividerColor,
    borderRightWidth: 1,
  },
  topText: {
    color: topItemColor,
    fontSize: topFontSize,
    lineHeight: topFontSize + 2,
    alignSelf: 'center',
    fontWeight: '600',
    flexShrink: 1,
  },
  topIcon: {
    fontSize: topFontSize,
    color: topItemColor,
    marginRight: GridSize / 2,
    alignSelf: 'center',
  },
  topIndicator: {
    width: topFontSize,
    height: topFontSize,
    borderRadius: topFontSize / 2,
    borderWidth: 1,
    marginRight: GridSize / 2,
    borderColor: topItemColor,
    alignSelf: 'center',
  },
  status: {
    flex: 1,
  },
  progressWrapper: {
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
    borderRightColor: currentDateBarColor,
  },
  imagesProgress: {
    top: GridSize,
    height: imageProgressHeight,
  },
  approvedImages: {
    backgroundColor: Color.approvedImage,
  },
  newImages: {
    backgroundColor: Color.newImage,
  },
});
