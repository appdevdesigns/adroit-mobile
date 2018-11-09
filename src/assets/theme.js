import material from 'native-base/src/theme/variables/material';
// import commonColor from 'native-base/src/theme/variables/commonColor';

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

export default {
  ...material,
  toolbarDefaultBg: Color.darkBackground,
  statusBarColor: Color.darkBackground,
};
