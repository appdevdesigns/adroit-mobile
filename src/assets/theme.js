import material from 'native-base/src/theme/variables/material';

export const Color = {
  darkBackground: '#302e4f',
  lightTextMuted: '#ccc',
};

export default {
  ...material,
  toolbarDefaultBg: Color.darkBackground,
  statusBarColor: Color.darkBackground,
};
