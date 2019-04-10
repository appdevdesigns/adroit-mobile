import { StyleSheet, Dimensions } from 'react-native';
import { baseFontSize } from 'src/assets/style';
import Theme, { GridSize, Color as ThemeColor } from 'src/assets/theme';

const { width } = Dimensions.get('window');

const screenPadding = GridSize * 2;

const contentWidth = width - screenPadding * 2;

const photoWidth = contentWidth * 0.8;

const statusImageWidth = (contentWidth - GridSize * 3) / 4;

const sectionItem = {
  marginBottom: GridSize * 2,
};

const fullWidthImage = (originalWidth, originalHeight) => ({
  width: photoWidth,
  height: (originalHeight / originalWidth) * photoWidth,
  ...sectionItem,
  marginLeft: 'auto',
  marginRight: 'auto',
});

export default StyleSheet.create({
  webViewWrapper: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  wrapper: {
    padding: screenPadding,
  },
  section: {
    paddingBottom: GridSize * 3,
  },
  title: {
    ...sectionItem,
  },
  paragraph: {
    marginBottom: GridSize * 2,
  },
  sectionLink: {
    ...sectionItem,
    marginLeft: GridSize * 2,
  },
  fullScreenshot: fullWidthImage(720, 1280),
  interfaceItem: {
    marginBottom: GridSize,
  },
  interfaceItemTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: GridSize,
  },
  interfaceItemBadge: {
    marginRight: GridSize,
  },
  listItem: {
    marginLeft: GridSize * 2,
    marginBottom: GridSize,
  },
  subListItem: {
    marginLeft: GridSize * 2,
    fontSize: baseFontSize - 2,
  },
  note: {
    fontSize: baseFontSize - 2,
  },
  drawerImage: fullWidthImage(899, 1106),
  statusBarImage: fullWidthImage(719, 116),
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: GridSize,
  },
  statusImage: {
    width: statusImageWidth,
    height: (52 / 182) * statusImageWidth,
    paddingLeft: GridSize / 2,
    paddingRight: GridSize / 2,
  },
  locationsImage: fullWidthImage(1125, 616),
  darkText: {
    color: ThemeColor.darkBackground,
  },
  redText: {
    color: Theme.brandDanger,
  },
  inlineIcon: {
    fontSize: baseFontSize,
  },
});
