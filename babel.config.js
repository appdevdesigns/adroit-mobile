const path = require('path');

const r = m => require.resolve(m);

function preset(api) {
  const root = path.join(__dirname, './');
  const sourcePaths = [root];
  api.cache(true);
  return {
    presets: [r('metro-react-native-babel-preset')],
    plugins: [
      [
        r('@babel/plugin-proposal-decorators'),
        {
          legacy: true,
        },
      ],
      [
        r('babel-plugin-module-resolver'),
        {
          root: sourcePaths,
          alias: {
            src: `${root}src`,
          },
          extensions: ['.js', '.ios.js', '.android.js'],
        },
      ],
    ],
  };
}

module.exports = preset;
