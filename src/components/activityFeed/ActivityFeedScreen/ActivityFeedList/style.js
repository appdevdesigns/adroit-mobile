import { StyleSheet } from 'react-native';
import { square } from 'src/assets/style';
import Theme, { Color, GridSize } from 'src/assets/theme';

export const thumbnailWidth = 100;
export const thumbnailHeight = 100;
export const thumbnailBorderWidth = 3;
export const imageWrapperSize = thumbnailWidth + thumbnailBorderWidth * 2;
export const teamFontSize = 14;
export const activityFontSize = 18;
export const captionFontSize = 14;
export const thumbnailBorderRadius = 50;

export const imageWrapperStyle = {
  backgroundColor: Color.darkBackground2,
  borderRadius: thumbnailBorderRadius,
  borderWidth: thumbnailBorderWidth
};

export default StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  date: {
    color: Theme.inverseTextColor,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 4,
    width: thumbnailWidth,
    borderBottomLeftRadius: thumbnailBorderRadius,
    borderBottomRightRadius: thumbnailBorderRadius
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
  imageWrapper: { ...imageWrapperStyle },
  thumbnail: {
    width: thumbnailWidth,
    height: thumbnailHeight,
    borderRadius: thumbnailBorderRadius,
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
  bold: {
    fontSize: captionFontSize,
    lineHeight: captionFontSize + 2,
    marginLeft: 10,
    marginRight: 0,
    fontWeight: 'bold',
    color: Color.darkTextSecondary,
  }
});
