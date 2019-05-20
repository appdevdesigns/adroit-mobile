import { StyleSheet } from 'react-native';
import Color from 'color';
import material from 'native-base/src/theme/variables/material';
import Theme, { IsSmallScreen, GridSize, Color as ThemeColor } from 'src/assets/theme';

const listItemFontSize = 17;
const tagHeight = 24;

export const square = size => ({
  width: size,
  height: size,
});

export const round = size => ({
  width: size,
  height: size,
  borderRadius: size / 2,
});

// HACK
export const StatusBarHeight = 8;

const manualHeader = {
  height: material.toolbarHeight,
  paddingTop: 0,
  paddingLeft: 10,
  paddingRight: 10,
};

if (material.platform === 'ios') {
  manualHeader.height += StatusBarHeight;
  manualHeader.paddingTop = 18;
}
if (material.isIphoneX) {
  manualHeader.height += material.Inset.portrait.topInset;
  manualHeader.paddingTop = 42;
}

export const logoDim = {
  width: 600,
  height: 200,
};

export const centerContent = {
  alignItems: 'center',
  justifyContent: 'center',
};

export const baseFontSize = IsSmallScreen ? Theme.DefaultFontSize - 2 : Theme.DefaultFontSize;

/**
 * App-wide reusable styles
 */
export default StyleSheet.create({
  manualHeader,
  safeView: {
    flex: 1,
  },
  headerLeft: {
    flex: 0.3,
    marginRight: GridSize,
    justifyContent: 'flex-start',
  },
  headerRight: {
    flex: 0.3,
    marginLeft: GridSize,
    justifyContent: 'flex-end',
  },
  headerBody: {
    ...centerContent,
  },
  separator: {
    paddingTop: Theme.platform === 'ios' ? 10 : 14,
    paddingBottom: Theme.platform === 'ios' ? 10 : 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: GridSize * 2,
    borderBottomColor: Theme.listBorderColor,
    borderBottomWidth: 0.5,
    paddingTop: GridSize * 2,
    paddingBottom: GridSize * 2,
    paddingRight: 0,
    backgroundColor: 'transparent',
  },
  unbordered: {
    borderBottomWidth: 0,
  },
  listItemIcon: {
    fontSize: listItemFontSize,
    flex: 0,
    color: Theme.textColor,
  },
  listItemText: {
    fontSize: listItemFontSize,
    flex: 1,
    color: Theme.textColor,
  },
  marginRight: {
    marginRight: GridSize,
  },
  marginLeft: {
    marginLeft: GridSize,
  },
  doubleMarginRight: {
    marginRight: GridSize * 2,
  },
  doublMarginLeft: {
    marginLeft: GridSize * 2,
  },
  paragraph: {
    marginBottom: GridSize,
    fontSize: baseFontSize,
  },
  emptyContainer: {
    flex: 1,
    ...centerContent,
    padding: GridSize * 4,
  },
  emptyText: {
    color: ThemeColor.darkTextMuted,
    textAlign: 'center',
  },
  buttonSpinner: {
    marginLeft: GridSize * 2 + 1.25,
    marginRight: GridSize * 2 + 1.25,
  },
  centeredOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    ...centerContent,
  },
  actionFooter: {
    paddingLeft: GridSize + Theme.buttonPadding,
    paddingRight: GridSize + Theme.buttonPadding,
    paddingTop: GridSize,
    paddingBottom: GridSize,
  },
  actionFooterButton: {
    alignSelf: 'center',
    flex: 1,
  },
  tag: {
    height: tagHeight,
    borderRadius: tagHeight / 2,
    backgroundColor: ThemeColor.lightBackground1,
    marginRight: GridSize,
    marginBottom: GridSize / 2,
    flex: 0,
    flexDirection: 'row',
    paddingRight: GridSize * 1.5,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  tagImageWrapper: {
    backgroundColor: Color(ThemeColor.lightBackground1).darken(0.1),
    ...centerContent,
    ...round(tagHeight),
    marginRight: GridSize,
  },
  tagAvatarIcon: {
    fontSize: 15,
    marginTop: 0,
    paddingRight: 0,
  },
  tagImage: {
    ...round(tagHeight),
  },
  tagText: {
    flex: 0,
    flexShrink: 1,
    flexGrow: 0,
    fontSize: 14,
  },
  subtleIcon: {
    color: ThemeColor.darkTextMuted,
  },
  bold: {
    fontWeight: 'bold',
  },
});
