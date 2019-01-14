import { Dimensions } from 'react-native';
import material from 'native-base/src/theme/variables/material';

const { width } = Dimensions.get('window');
const BREAKPOINT = 400;

export const Color = {
  darkBackground: '#1f6b8d',
  darkBackground2: '#2E2F3B',
  lightTextMuted: '#ccc',
  darkTextMuted: '#888888',
  darkTextSecondary: '#5B5B5B',
  lightBackground: '#FFF',
  lightBackground1: '#ECECF1',
  approvedImage: '#019e8b',
  newImage: '#333333',
};

export const GridSize = 8;

export const IsSmallScreen = width < BREAKPOINT;

export default {
  ...material,
  brandPrimary: Color.darkBackground,
  toolbarDefaultBg: Color.darkBackground,
  toolbarDefaultBorder: Color.darkBackground,
  tabActiveBgColor: Color.darkBackground,
  footerDefaultBg: Color.darkBackground,
  statusBarColor: Color.darkBackground,
  listItemSelected: Color.darkBackground,
  radioSelectedColorAndroid: Color.darkBackground,
  segmentBackgroundColor: Color.darkBackground,
  segmentActiveTextColor: Color.darkBackground,
  segmentBorderColorMain: Color.darkBackground,
  checkboxBgColor: Color.darkBackground,
  tabDefaultBg: Color.darkBackground,
  defaultProgressColor: material.brandSuccess,
  get btnPrimaryBg() {
    return Color.darkBackground;
  },
};
