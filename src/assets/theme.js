import material from 'native-base/src/theme/variables/material';

export const Color = {
  darkBackground: '#302e4f',
  darkBackground2: '#2E2F3B',
  lightTextMuted: '#ccc',
  darkTextMuted: '#888888',
  darkTextSecondary: '#5B5B5B',
  lightBackground: '#FFF',
  lightBackground1: '#ECECF1',
};

export const GridSize = 8;

export default {
  ...material,
  toolbarDefaultBg: Color.darkBackground,
  statusBarColor: Color.darkBackground,
};
