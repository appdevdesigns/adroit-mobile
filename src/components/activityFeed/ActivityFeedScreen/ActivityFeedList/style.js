import { StyleSheet } from 'react-native';
import Theme, { Color, GridSize } from 'src/assets/theme';

export const thumbnailWidth = 80;
export const thumbnailBorderWidth = 3;
export const imageWrapperSize = thumbnailWidth + thumbnailBorderWidth * 2;
export const teamFontSize = 12;
export const activityFontSize = 12;
export const captionFontSize = 12;
const thumbnailBorderRadius = 4;

export default StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  date: {
    color: Theme.inverseTextColor,
    fontSize: 12,
    marginBottom: 3.5,
  },
  listItem: {
    flexDirection: 'row',
    paddingRight: GridSize * 2,
    paddingTop: GridSize,
    paddingBottom: GridSize,
    paddingLeft: GridSize * 2,
    marginLeft: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  left: {
    flex: 0,
  },
  body: {
    flex: 1,
    marginLeft: GridSize * 2,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  imageWrapper: {
    backgroundColor: Color.darkBackground2,
    borderRadius: thumbnailBorderRadius,
    borderWidth: thumbnailBorderWidth,
  },
  thumbnail: {
    width: thumbnailWidth,
    height: 60,
    borderBottomRightRadius: thumbnailBorderRadius - 1,
    borderBottomLeftRadius: thumbnailBorderRadius - 1,
  },
  approvedImage: {
    backgroundColor: Color.approvedImage,
    borderColor: Color.approvedImage,
  },
  newImage: {
    backgroundColor: Color.newImage,
    borderColor: Color.newImage,
  },
  deniedImage: {
    backgroundColor: Theme.brandDanger,
    borderColor: Theme.brandDanger,
  },
  activity: {
    fontWeight: 'bold',
    fontSize: activityFontSize,
    marginLeft: 0,
    marginRight: 0,
  },
  team: {
    fontSize: teamFontSize,
    color: Color.darkTextMuted,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 4,
  },
  caption: {
    fontSize: captionFontSize,
    lineHeight: captionFontSize + 2,
    marginLeft: 0,
    marginRight: 0,
    color: Color.darkTextSecondary,
  },
});
